import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  restaurants: router({
    list: publicProcedure.query(async () => {
      return db.getAllRestaurants();
    }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getRestaurantById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
        deliveryTime: z.number().optional(),
        deliveryFee: z.number().optional(),
        promo: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create restaurants");
        }
        return db.createRestaurant(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        deliveryTime: z.number().optional(),
        deliveryFee: z.number().optional(),
        promo: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update restaurants");
        }
        const { id, ...data } = input;
        return db.updateRestaurant(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can delete restaurants");
        }
        return db.deleteRestaurant(input.id);
      }),
  }),

  foodItems: router({
    listByRestaurant: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return db.getFoodItemsByRestaurant(input.restaurantId);
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getFoodItemById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
        price: z.number().min(0),
        category: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create food items");
        }
        return db.createFoodItem(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        price: z.number().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update food items");
        }
        const { id, ...data } = input;
        return db.updateFoodItem(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can delete food items");
        }
        return db.deleteFoodItem(input.id);
      }),
  }),

  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserOrders(ctx.user.id);
    }),

    listByUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (input.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return db.getUserOrders(input.userId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (order?.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return order;
      }),

    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        return db.getOrderByNumber(input.orderNumber);
      }),

    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        items: z.array(z.object({
          foodItemId: z.number(),
          quantity: z.number().min(1),
          price: z.number(),
        })),
        totalAmount: z.number(),
        deliveryFee: z.number(),
        subtotal: z.number(),
        paymentMethod: z.enum(["cash", "gcash", "stripe"]),
        deliveryAddress: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const result = await db.createOrder({
          orderNumber,
          userId: ctx.user.id,
          restaurantId: input.restaurantId,
          totalAmount: input.totalAmount,
          deliveryFee: input.deliveryFee,
          subtotal: input.subtotal,
          paymentMethod: input.paymentMethod,
          deliveryAddress: input.deliveryAddress,
          status: "pending",
        });

        // Get the created order to retrieve its ID
        const createdOrder = await db.getOrderByNumber(orderNumber);
        if (!createdOrder) {
          throw new Error("Failed to retrieve created order");
        }

        for (const item of input.items) {
          await db.createOrderItem({
            orderId: createdOrder.id,
            foodItemId: item.foodItemId,
            quantity: item.quantity,
            price: item.price,
          });
        }

        return { orderNumber, success: true };
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update order status");
        }
        return db.updateOrderStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
