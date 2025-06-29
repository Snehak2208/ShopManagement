import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

// Test data
const testUser = {
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer'
};

const testShopkeeper = {
    email: 'shopkeeper@test.com',
    password: 'password123',
    role: 'shopkeeper'
};

let customerToken = '';
let productId = '';

async function testPurchase() {
    console.log('🧪 Testing Purchase System...\n');

    try {
        // Step 1: Register customer
        console.log('1️⃣ Registering customer...');
        const registerCustomerResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const registerCustomerResult = await registerCustomerResponse.json();
        console.log('Customer registration:', registerCustomerResult.status ? '✅ Success' : '❌ Failed');

        // Step 2: Register shopkeeper
        console.log('\n2️⃣ Registering shopkeeper...');
        const registerShopkeeperResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testShopkeeper)
        });
        const registerShopkeeperResult = await registerShopkeeperResponse.json();
        console.log('Shopkeeper registration:', registerShopkeeperResult.status ? '✅ Success' : '❌ Failed');

        // Step 3: Login customer
        console.log('\n3️⃣ Logging in customer...');
        const loginCustomerResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const loginCustomerResult = await loginCustomerResponse.json();
        console.log('Customer login:', loginCustomerResult.status ? '✅ Success' : '❌ Failed');

        if (loginCustomerResult.status) {
            // Get cookies from response
            const cookies = loginCustomerResponse.headers.get('set-cookie');
            if (cookies) {
                customerToken = cookies.split(';')[0].split('=')[1];
            }
        }

        // Step 4: Login shopkeeper and add product
        console.log('\n4️⃣ Logging in shopkeeper and adding product...');
        const loginShopkeeperResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testShopkeeper.email, password: testShopkeeper.password })
        });
        const loginShopkeeperResult = await loginShopkeeperResponse.json();
        console.log('Shopkeeper login:', loginShopkeeperResult.status ? '✅ Success' : '❌ Failed');

        if (loginShopkeeperResult.status) {
            // Add a test product
            const addProductResponse = await fetch(`${BASE_URL}/insert`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie': `token=${loginShopkeeperResponse.headers.get('set-cookie')?.split(';')[0].split('=')[1]}`
                },
                body: JSON.stringify({
                    p_name: 'Test Product',
                    p_price: 100,
                    p_stock: 10
                })
            });
            const addProductResult = await addProductResponse.json();
            console.log('Add product:', addProductResult.status ? '✅ Success' : '❌ Failed');
        }

        // Step 5: Get all products
        console.log('\n5️⃣ Getting all products...');
        const getProductsResponse = await fetch(`${BASE_URL}/products/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const getProductsResult = await getProductsResponse.json();
        console.log('Get products:', getProductsResult.status ? '✅ Success' : '❌ Failed');
        
        if (getProductsResult.status && getProductsResult.data.length > 0) {
            productId = getProductsResult.data[0]._id;
            console.log('Found product ID:', productId);
        }

        // Step 6: Test purchase
        if (productId && customerToken) {
            console.log('\n6️⃣ Testing purchase...');
            const purchaseResponse = await fetch(`${BASE_URL}/purchase`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie': `token=${customerToken}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: 1
                })
            });
            const purchaseResult = await purchaseResponse.json();
            console.log('Purchase result:', purchaseResult);
            console.log('Purchase:', purchaseResult.status ? '✅ Success' : '❌ Failed');
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testPurchase(); 