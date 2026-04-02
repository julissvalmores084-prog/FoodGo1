import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock database module
vi.mock("./db", () => ({
  getAllRestaurants: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Mang Inasal",
      category: "Filipino",
      description: "Grilled Chicken Specialists",
      image: "https://example.com/mang-inasal.jpg",
      rating: 4,
      deliveryTime: 30,
      deliveryFee: 5000,
      promo: "10% off",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Jollibee",
      category: "Filipino",
      description: "Crispy Fried Chicken",
      image: "https://example.com/jollibee.jpg",
      rating: 5,
      deliveryTime: 25,
      deliveryFee: 4500,
      promo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getRestaurantById: vi.fn().mockResolvedValue({
    id: 1,
    name: "Mang Inasal",
    category: "Filipino",
    description: "Grilled Chicken Specialists",
    image: "https://example.com/mang-inasal.jpg",
    rating: 4,
    deliveryTime: 30,
    deliveryFee: 5000,
    promo: "10% off",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  createRestaurant: vi.fn().mockResolvedValue({ insertId: 3 }),
  updateRestaurant: vi.fn().mockResolvedValue({ success: true }),
  deleteRestaurant: vi.fn().mockResolvedValue({ success: true }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthenticatedContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: User = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("restaurants router", () => {
  describe("list", () => {
    it("should return all restaurants without authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.restaurants.list();

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe("Mang Inasal");
      expect(result[1]?.name).toBe("Jollibee");
    });
  });

  describe("get", () => {
    it("should return a specific restaurant by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.restaurants.get({ id: 1 });

      expect(result?.name).toBe("Mang Inasal");
      expect(result?.category).toBe("Filipino");
    });
  });

  describe("create", () => {
    it("should allow admins to create restaurants", async () => {
      const ctx = createAuthenticatedContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.restaurants.create({
        name: "New Restaurant",
        category: "Italian",
        description: "Italian cuisine",
        deliveryTime: 35,
        deliveryFee: 6000,
      });

      expect(result).toEqual({ insertId: 3 });
    });

    it("should prevent non-admins from creating restaurants", async () => {
      const ctx = createAuthenticatedContext("user");
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.restaurants.create({
          name: "New Restaurant",
          category: "Italian",
        })
      ).rejects.toThrow("Only admins can create restaurants");
    });
  });

  describe("update", () => {
    it("should allow admins to update restaurants", async () => {
      const ctx = createAuthenticatedContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.restaurants.update({
        id: 1,
        name: "Updated Mang Inasal",
        promo: "20% off",
      });

      expect(result).toEqual({ success: true });
    });

    it("should prevent non-admins from updating restaurants", async () => {
      const ctx = createAuthenticatedContext("user");
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.restaurants.update({
          id: 1,
          name: "Updated Name",
        })
      ).rejects.toThrow("Only admins can update restaurants");
    });
  });

  describe("delete", () => {
    it("should allow admins to delete restaurants", async () => {
      const ctx = createAuthenticatedContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.restaurants.delete({ id: 1 });

      expect(result).toEqual({ success: true });
    });

    it("should prevent non-admins from deleting restaurants", async () => {
      const ctx = createAuthenticatedContext("user");
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.restaurants.delete({ id: 1 })
      ).rejects.toThrow("Only admins can delete restaurants");
    });
  });
});
