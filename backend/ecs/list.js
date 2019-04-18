'use strict';
import ECS from 'aws-sdk/clients/ecs'

const ecs = new ECS({region:'us-east-1'})

export async function main(event, context) {
	let clusters = await ecs.listClusters().promise()
	console.log(clusters)
	let clusterDetails = await ecs.describeClusters({clusters:clusters.clusterArns}).promise()
	console.log(clusterDetails)
	// console.log(clusters.clusterArns)
  return {
    statusCode: 200,
    body: JSON.stringify(clusterDetails)

	};
}
