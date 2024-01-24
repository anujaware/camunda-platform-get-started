const { ZBClient } = require('zeebe-node')
const axios = require('axios');
const zbc = new ZBClient()

function handleHttpRequest({ method, apiUrl, headers, payload }) {
  headers = headers || {};
  headers['Content-Type'] = 'application/json';

  const config = {
    method,
    url: apiUrl,
    headers,
    params: method === 'GET' ? payload : undefined,
    data: method !== 'GET' ? payload : undefined,
  };

  return axios(config);
}

zbc.createWorker({
  taskType: 'api_handler',
  taskHandler: async (job, _, worker) => {
    try {
      const variables = job.variables;
      const apiUrl = variables['baseUrl'] + variables['relativePath'];
      const headers = variables['apiHeader'];
      const method = variables['httpMethod'] || 'GET'; // Default to GET if not provided
      const payload = variables['requestPayload'];

      console.log(variables);
      console.log('Response from ' + apiUrl);

      const response = await handleHttpRequest({
        method,
        apiUrl,
        headers,
        payload,
      });

      console.log(response.data);
      console.log("Response Type:", typeof response.data);

      var params = {}
      var updatedVariables = Object.assign(params, response.data);
      console.log(updatedVariables)

      // Handle the successful response
      job.complete({'params': updatedVariables});
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);
      job.fail(error.message);
    }
  },
});
