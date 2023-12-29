const axios = require('axios');

// Define the API endpoint and headers
const apiUrl = 'http://localhost:3000/home/data?values=distance_calculation_api_url,iot_api_token';
const headers = {
//   'Authorization': 'Bearer your_access_token',
  'Content-Type': 'application/json',
  // Add any other headers you need
};

// Make the GET request with custom headers
axios.get(apiUrl, { headers })
  .then(response => {
    debugger
    // Handle the successful response
    console.log('Response:', response.data);
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });
