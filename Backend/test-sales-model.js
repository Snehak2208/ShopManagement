import mongoose from 'mongoose';
import Sale from './Models/salesModal.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSalesModel() {
    console.log('🧪 Testing Sales Model...\n');

    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Test creating a sale with minimal data
        console.log('\n📝 Testing sale creation...');
        const testSale = new Sale({
            productId: new mongoose.Types.ObjectId(),
            customerId: new mongoose.Types.ObjectId(),
            shopkeeperId: new mongoose.Types.ObjectId(),
            quantity: 1,
            totalPrice: 100,
            purchaseDate: new Date()
        });

        console.log('Sale object created:', testSale);
        
        // Validate the sale
        const validationError = testSale.validateSync();
        if (validationError) {
            console.log('❌ Validation error:', validationError.message);
        } else {
            console.log('✅ Sale validation passed');
        }

        // Try to save the sale
        const savedSale = await testSale.save();
        console.log('✅ Sale saved successfully:', savedSale._id);

        // Clean up - delete the test sale
        await Sale.findByIdAndDelete(savedSale._id);
        console.log('🧹 Test sale cleaned up');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the test
testSalesModel(); 