const { ZBClient } = require('zeebe-node')


// ZB client for Camunda Platform 8 SaaS cluster
/*const zbc = new ZBClient({
	camundaCloud: {
		clusterId: 'YOUR_CLUSTER_ID',
		clientId: 'YOUR_CLIENT_ID',
		clientSecret: 'YOUR_CLIENT_SECRET',
	},
})
*/

// ZB client for self managed cluster
const zbc = new ZBClient()

zbc.createWorker({
	taskType: 'email',
	taskHandler: (job, _, worker) => {
	  console.log(job)
		const { message_content } = job.variables
		console.log(`Sending email with message content: ${message_content}`)
		job.complete()
	}
})
