'use strict';
import ECS from 'aws-sdk/clients/ecs'

const ecs = new ECS({region:'us-east-1'})

export async function getClusters(event, context) {
	let clusters = await ecs.listClusters().promise()
	console.log(clusters)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
		}),

	};


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
