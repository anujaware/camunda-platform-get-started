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
const distance_data = { 'baner-balewadi': 4, 'baner-pune_university': 6,
  'baner-shivaji_nagar': 7, 'baner-Kothrud': 11, 'balewadi-baner': 4,
  'balewadi-pune_university': 10, 'balewadi-shivaji_nagar': 13, 'balewadi-Kothrud': 14
}

zbc.createWorker({
  taskType: 'distance_cost',
  taskHandler: async (job, _, worker) => {
    console.log(job)
    const variables = job.variables
    const pickup = variables.pickup_point
    const destination = variables.destination

    var [distance, cost] = calculate_distance(pickup, destination)

    //Make a db call and store distance and cost
    //var booking_obj = VehicleBooking.find(booking_id)
    //booking_obj.update({distance: distance, cost: cost})

    const bookingObj = Object.assign(
      variables,
      {
	booking_id: 2,
	process_instance_key: job.processInstanceKey,
	bpmn_process_id: job.bpmnProcessId,
	distance: distance, cost: cost
      }
    )
    var result = await pgClient.query(`INSERT INTO vehicle_bookings \
    (status,request_id,vehicle_category,destination,phone_number,pickup_point,
     bpmn_process_id,distance,cost,process_instance_key,
     created_at,updated_at)
    VALUES ('${bookingObj.status}', '${bookingObj.request_id}', '${bookingObj.vehicle_category}',
      '${bookingObj. destination}',
      '${bookingObj.phone_number}', '${bookingObj.pickup_point}', '${bookingObj.bpmn_process_id}',
      '${bookingObj.distance}', '${bookingObj.cost}', '${bookingObj.process_instance_key}',NOW(), NOW())`)

    job.complete({'booking_id': bookingObj.request_id})
  }
})

function calculate_distance(pickup, destination){
  console.log(pickup, destination)
  distance = distance_data[pickup+'-'+destination]
  cost = distance * 6
  console.log(distance, cost)
  return [distance, cost]
}
