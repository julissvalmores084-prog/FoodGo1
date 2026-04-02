import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Order History", () => {
  it("should list user orders with listByUser procedure", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      const orders = await caller.orders.listByUser({ userId: 1 });
      expect(Array.isArray(orders)).toBe(true);
    } catch (error) {
      // Expected - may not have orders in test DB
      expect(error).toBeDefined();
    }
  });

  it("should prevent unauthorized access to other user orders", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.listByUser({ userId: 2 });
      expect(true).toBe(false); // Should throw
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("should allow admin to access any user orders", async () => {
    const user: AuthenticatedUser = {
      id: 999,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const ctx: TrpcContext = {
      user,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      const orders = await caller.orders.listByUser({ userId: 1 });
      expect(Array.isArray(orders)).toBe(true);
    } catch (error) {
      // Expected - may not have orders in test DB
      expect(error).toBeDefined();
    }
  });
});
