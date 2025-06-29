import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'TestPass123!',
    role: 'customer'
};

async function testAuth() {
    console.log('🧪 Testing Authentication System...\n');

    try {
        // Test 1: Registration
        console.log('1️⃣ Testing Registration...');
        const registerResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });
        
        const registerResult = await registerResponse.json();
        console.log('Registration Response:', registerResult);
        
        if (!registerResult.status) {
            console.log('❌ Registration failed:', registerResult.message);
            return;
        }
        
        console.log('✅ Registration successful!\n');

        // Test 2: Login
        console.log('2️⃣ Testing Login...');
        const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        
        const loginResult = await loginResponse.json();
        console.log('Login Response:', loginResult);
        
        if (!loginResult.status) {
            console.log('❌ Login failed:', loginResult.message);
            return;
        }
        
        console.log('✅ Login successful!');
        console.log('User Role:', loginResult.role);
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testAuth(); 