import { createConnection } from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

const restaurants = [
  {
    name: 'McDonald\'s',
    description: 'Fast food burgers, fries, and beverages',
    category: 'Fast Food',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663505341054/dyrz4oDf3V9QzFfnjxjshV/mcdonalds-hero-cxSDenHRsoAUNjDv5ge5Ag.webp',
    deliveryTime: 20,
    deliveryFee: 5000,
  },
  {
    name: 'KFC',
    description: 'Crispy fried chicken and sides',
    category: 'Fast Food',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663505341054/dyrz4oDf3V9QzFfnjxjshV/kfc-hero-cvLBmjy6e4G3Feduscp8YH.webp',
    deliveryTime: 25,
    deliveryFee: 5000,
  },
  {
    name: 'Chowking',
    description: 'Asian fusion noodles and chicken',
    category: 'Asian Fusion',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663505341054/dyrz4oDf3V9QzFfnjxjshV/chowking-hero-aC4p2n5sto9uVk4zs8TcJf.webp',
    deliveryTime: 30,
    deliveryFee: 6000,
  },
];

const foodItems = {
  'McDonald\'s': [
    { name: 'Big Mac', description: 'Two all-beef patties, special sauce', price: 17500 },
    { name: 'Quarter Pounder', description: 'Quarter pound beef patty', price: 16500 },
    { name: 'McChicken', description: 'Crispy chicken sandwich', price: 12500 },
    { name: 'French Fries', description: 'Golden crispy fries', price: 8500 },
    { name: 'Chicken McNuggets', description: '6 piece crispy nuggets', price: 14500 },
  ],
  'KFC': [
    { name: '8pc Chicken Bucket', description: 'Original recipe fried chicken', price: 35900 },
    { name: '4pc Chicken Meal', description: 'Chicken, fries, and drink', price: 19900 },
    { name: 'Spicy Wings', description: 'Crispy spicy chicken wings', price: 15900 },
    { name: 'Popcorn Chicken', description: 'Bite-sized chicken pieces', price: 12900 },
    { name: 'Coleslaw', description: 'Fresh coleslaw side', price: 6900 },
  ],
  'Chowking': [
    { name: 'Chow Mein', description: 'Stir-fried noodles with vegetables', price: 15900 },
    { name: 'Fried Rice', description: 'Egg fried rice with meat', price: 14900 },
    { name: 'Chicken Lollipop', description: 'Crispy chicken lollipops', price: 16900 },
    { name: 'Siomai', description: 'Steamed pork dumplings (6pc)', price: 10900 },
    { name: 'Lumpiang Shanghai', description: 'Fried spring rolls (4pc)', price: 9900 },
  ],
};

async function seedDatabase() {
  let connection;
  try {
    connection = await createConnection(process.env.DATABASE_URL);
    console.log('✅ Connected to database');

    for (const restaurant of restaurants) {
      const [result] = await connection.execute(
        'INSERT INTO restaurants (name, description, category, image, deliveryTime, deliveryFee) VALUES (?, ?, ?, ?, ?, ?)',
        [restaurant.name, restaurant.description, restaurant.category, restaurant.image, restaurant.deliveryTime, restaurant.deliveryFee]
      );

      const restaurantId = result.insertId;
      console.log(`✅ Added restaurant: ${restaurant.name} (ID: ${restaurantId})`);

      const items = foodItems[restaurant.name] || [];
      for (const item of items) {
        await connection.execute(
          'INSERT INTO foodItems (restaurantId, name, description, price, image) VALUES (?, ?, ?, ?, ?)',
          [restaurantId, item.name, item.description, item.price, null]
        );
      }
      console.log(`   ✅ Added ${items.length} food items`);
    }

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

seedDatabase();
