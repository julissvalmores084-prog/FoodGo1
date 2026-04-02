import { drizzle } from "drizzle-orm/mysql2";
import { restaurants, foodItems } from "../drizzle/schema.ts";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seed() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("🌱 Seeding database...");

    // Sample restaurants
    const sampleRestaurants = [
      {
        name: "Mang Inasal",
        description: "Grilled Chicken Specialists - Authentic Filipino Flavors",
        category: "Filipino",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663505341054/dyrz4oDf3V9QzFfnjxjshV/mang-inasal-hero-GFeZAPaF6E2jGCZrgBzFHV.webp",
        deliveryTime: 30,
        deliveryFee: 5000,
        promo: "Buy 1 Take 1 on Chicken Inasal",
        rating: 0,
      },
      {
        name: "Jollibee",
        description: "Crispy Fried Chicken Paradise - Loved by Millions",
        category: "Filipino",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663505341054/dyrz4oDf3V9QzFfnjxjshV/jollibee-hero-jJhwsMN87YArSAPtbUyF5p.webp",
        deliveryTime: 25,
        deliveryFee: 5000,
        promo: "Free Fries with Combo Meals",
        rating: 0,
      },
      {
        name: "McDonald's",
        description: "Fast Food Favorites - I'm Lovin' It",
        category: "Fast Food",
        image: null,
        deliveryTime: 20,
        deliveryFee: 4000,
        promo: "Happy Meal Discount",
        rating: 0,
      },
      {
        name: "KFC",
        description: "Finger Lickin' Good Fried Chicken",
        category: "Fast Food",
        image: null,
        deliveryTime: 30,
        deliveryFee: 5000,
        promo: "Bucket Meals Special",
        rating: 0,
      },
      {
        name: "Chowking",
        description: "Asian Cuisine - Chinese and Filipino Fusion",
        category: "Asian",
        image: null,
        deliveryTime: 35,
        deliveryFee: 5000,
        promo: "Noodle Combo Promo",
        rating: 0,
      },
    ];

    // Insert restaurants
    const insertedRestaurants = await db.insert(restaurants).values(sampleRestaurants);
    console.log(`✅ Inserted ${sampleRestaurants.length} restaurants`);

    // Sample food items for Mang Inasal
    const mangInsalFoods = [
      {
        restaurantId: 1,
        name: "Chicken Inasal",
        description: "Grilled chicken marinated in special sauce",
        category: "Grilled",
        price: 15000,
        image: null,
      },
      {
        restaurantId: 1,
        name: "Pork BBQ",
        description: "Grilled pork skewers with sweet BBQ sauce",
        category: "Grilled",
        price: 12000,
        image: null,
      },
      {
        restaurantId: 1,
        name: "Lumpiang Shanghai",
        description: "Crispy spring rolls with meat filling",
        category: "Appetizer",
        price: 8000,
        image: null,
      },
      {
        restaurantId: 1,
        name: "Garlic Rice",
        description: "Fragrant garlic fried rice",
        category: "Rice",
        price: 5000,
        image: null,
      },
    ];

    // Sample food items for Jollibee
    const jollibeeFood = [
      {
        restaurantId: 2,
        name: "Chickenjoy",
        description: "Crispy fried chicken - the signature dish",
        category: "Fried Chicken",
        price: 14000,
        image: null,
      },
      {
        restaurantId: 2,
        name: "Spaghetti",
        description: "Sweet and savory Filipino-style spaghetti",
        category: "Pasta",
        price: 10000,
        image: null,
      },
      {
        restaurantId: 2,
        name: "Burger Steak",
        description: "Juicy beef burger with gravy",
        category: "Burger",
        price: 12000,
        image: null,
      },
      {
        restaurantId: 2,
        name: "Peach Mango Pie",
        description: "Sweet and delicious dessert",
        category: "Dessert",
        price: 6000,
        image: null,
      },
    ];

    // Sample food items for McDonald's
    const mcdonaldsFoods = [
      {
        restaurantId: 3,
        name: "Big Mac",
        description: "Two all-beef patties, special sauce",
        category: "Burger",
        price: 13000,
        image: null,
      },
      {
        restaurantId: 3,
        name: "Chicken McNuggets",
        description: "Crispy golden nuggets",
        category: "Chicken",
        price: 11000,
        image: null,
      },
      {
        restaurantId: 3,
        name: "French Fries",
        description: "Golden crispy fries",
        category: "Sides",
        price: 5000,
        image: null,
      },
    ];

    // Sample food items for KFC
    const kfcFoods = [
      {
        restaurantId: 4,
        name: "Original Recipe Chicken",
        description: "Finger lickin' good fried chicken",
        category: "Fried Chicken",
        price: 16000,
        image: null,
      },
      {
        restaurantId: 4,
        name: "Spicy Chicken",
        description: "Hot and spicy fried chicken",
        category: "Fried Chicken",
        price: 16000,
        image: null,
      },
      {
        restaurantId: 4,
        name: "Gravy",
        description: "Creamy chicken gravy",
        category: "Sauce",
        price: 3000,
        image: null,
      },
    ];

    // Sample food items for Chowking
    const chowkingFoods = [
      {
        restaurantId: 5,
        name: "Chow Mein",
        description: "Stir-fried noodles with meat and vegetables",
        category: "Noodles",
        price: 12000,
        image: null,
      },
      {
        restaurantId: 5,
        name: "Siomai",
        description: "Steamed pork dumplings",
        category: "Dim Sum",
        price: 9000,
        image: null,
      },
      {
        restaurantId: 5,
        name: "Lumpiang Shanghai",
        description: "Crispy spring rolls",
        category: "Appetizer",
        price: 8000,
        image: null,
      },
    ];

    const allFoodItems = [
      ...mangInsalFoods,
      ...jollibeeFood,
      ...mcdonaldsFoods,
      ...kfcFoods,
      ...chowkingFoods,
    ];

    await db.insert(foodItems).values(allFoodItems);
    console.log(`✅ Inserted ${allFoodItems.length} food items`);

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
