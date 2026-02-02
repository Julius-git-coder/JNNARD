// Test script to simulate frontend API call
import axios from 'axios';

const testAPI = async () => {
    try {
        console.log('Testing /api/workers endpoint...\n');

        const response = await axios.get('http://localhost:5000/api/workers');

        console.log('✅ Success! Status:', response.status);
        console.log('\n📊 Workers received:', response.data.length);
        console.log('\n👥 Worker list:');

        response.data.forEach((worker, i) => {
            console.log(`${i + 1}. ${worker.name} (${worker.role}) - ${worker.email}`);
        });

        // Check if Frank is in the response
        const frank = response.data.find(w => w.email === 'frank@gmail.com');

        if (frank) {
            console.log('\n✅ FRANK IS IN THE RESPONSE!');
            console.log('Frank details:', JSON.stringify(frank, null, 2));
        } else {
            console.log('\n❌ FRANK IS MISSING FROM THE RESPONSE!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

testAPI();
