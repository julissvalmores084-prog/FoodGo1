import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, restaurants, foodItems, orders, orderItems, userAddresses, favorites } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Restaurant queries
export async function getAllRestaurants() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(restaurants);
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createRestaurant(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(restaurants).values(data);
}

export async function updateRestaurant(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(restaurants).set(data).where(eq(restaurants.id, id));
}

export async function deleteRestaurant(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(restaurants).where(eq(restaurants.id, id));
}

// Food item queries
export async function getFoodItemsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(foodItems).where(eq(foodItems.restaurantId, restaurantId));
}

export async function getFoodItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(foodItems).where(eq(foodItems.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createFoodItem(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(foodItems).values(data);
}

export async function updateFoodItem(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(foodItems).set(data).where(eq(foodItems.id, id));
}

export async function deleteFoodItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(foodItems).where(eq(foodItems.id, id));
}

// Order queries
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrder(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orders).values(data);
}

export async function updateOrderStatus(id: number, status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrderItem(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orderItems).values(data);
}

// User address queries
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
}

export async function createUserAddress(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(userAddresses).values(data);
}

export async function updateUserAddress(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(userAddresses).set(data).where(eq(userAddresses.id, id));
}

export async function deleteUserAddress(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(userAddresses).where(eq(userAddresses.id, id));
}

// Favorites queries
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function addFavorite(userId: number, foodItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(favorites).values({ userId, foodItemId });
}

export async function removeFavorite(userId: number, foodItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.foodItemId, foodItemId)));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders);
}
