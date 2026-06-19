async function testDelete() {
    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log('Response:', response.status, data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testDelete();
