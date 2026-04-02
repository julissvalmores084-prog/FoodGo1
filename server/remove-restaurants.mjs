import { createConnection } from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

async function removeRestaurants() {
  let connection;
  try {
    connection = await createConnection(process.env.DATABASE_URL);
    console.log('✅ Connected to database');

    const restaurantNames = ['McDonald\'s', 'KFC', 'Chowking'];

    for (const name of restaurantNames) {
      // Get restaurant ID
      const [restaurants] = await connection.execute(
        'SELECT id FROM restaurants WHERE name = ?',
        [name]
      );

      if (restaurants.length > 0) {
        const restaurantId = restaurants[0].id;

        // Delete food items for this restaurant
        await connection.execute(
          'DELETE FROM foodItems WHERE restaurantId = ?',
          [restaurantId]
        );

        // Delete the restaurant
        await connection.execute(
          'DELETE FROM restaurants WHERE id = ?',
          [restaurantId]
        );

        console.log(`✅ Removed restaurant: ${name}`);
      } else {
        console.log(`⚠️  Restaurant not found: ${name}`);
      }
    }

    console.log('\n✅ Successfully removed all three restaurants!');
  } catch (error) {
    console.error('❌ Error removing restaurants:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

removeRestaurants();
