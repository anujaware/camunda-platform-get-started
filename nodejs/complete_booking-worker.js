const { ZBClient } = require('zeebe-node')
const { Client } = require('pg')
const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'workflow_poc_development',
  password: '',
  port: 5432,
})
pgClient.connect(async function(err) {
  if (err) throw err;
  console.log("Connected!");
});



// ZB client for self managed cluster
const zbc = new ZBClient()

zbc.createWorker({
  taskType: 'complete_booking',
  taskHandler: async (job, _, worker) => {
    console.log(job)
    const variables = job.variables
    
    var result = await pgClient.query(`UPDATE vehicle_bookings SET
      status='${variables.status}' where request_id='${variables.request_id}'`)

    job.complete()
  }
})

function calculate_distance(pickup, destination){
  console.log(pickup, destination)
  distance = distance_data[pickup+'-'+destination]
  cost = distance * 6
  console.log(distance, cost)
  return [distance, cost]
}
