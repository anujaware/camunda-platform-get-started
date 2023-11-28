const { ZBClient } = require('zeebe-node')

void (async () => {
  // ZB client for self managed cluster
  const zbc = new ZBClient()

  // ZB client for Camunda Platform 8 SaaS cluster
  /*	const zbc = new ZBClient({
		camundaCloud: {
			clusterId: 'YOUR_CLUSTER_ID',
			clientId: 'YOUR_CLIENT_ID',
			clientSecret: 'YOUR_CLIENT_SECRET',
		},
	})
	*/
  await zbc.deployProcess(['../process/send-email.bpmn'])

  const result = await zbc.createProcessInstance('send-email', {
    message_content: 'Hello from the node.js get started',
  })

  console.log(result)
})()
