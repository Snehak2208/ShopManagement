import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixSalesUniqueIndex() {
    console.log('🔧 Fixing Sales Collection Unique Index...\n');

    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get the database instance
        const db = mongoose.connection.db;
        
        // Drop the unique index on cust_email field
        console.log('🗑️ Dropping unique index on cust_email...');
        try {
            await db.collection('sales').dropIndex('cust_email_1');
            console.log('✅ Successfully dropped unique index on cust_email');
        } catch (error) {
            if (error.code === 27) { // Index not found
                console.log('ℹ️ Unique index on cust_email does not exist (already fixed)');
            } else {
                console.log('⚠️ Error dropping index:', error.message);
            }
        }

        // List all indexes to verify
        console.log('\n📋 Current indexes on sales collection:');
        const indexes = await db.collection('sales').indexes();
        indexes.forEach(index => {
            console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
        });

        console.log('\n✅ Sales collection unique index fix completed!');
        console.log('💡 You can now create multiple sales records.');

    } catch (error) {
        console.error('❌ Error fixing sales index:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the fix
fixSalesUniqueIndex(); 