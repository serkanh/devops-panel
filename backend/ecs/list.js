'use strict';
import ECS from 'aws-sdk/clients/ecs'

const ecs = new ECS({region:'us-east-1' })

export async function main(event, context) {
	// This is to prevent cors on local development.
	// TODO: Remove when going to prod



	try {
		let clusters = await ecs.listClusters().promise()
		let clusterDetails = await ecs.describeClusters({clusters:clusters.clusterArns}).promise()
		return {
			statusCode: 200,
			headers: { 	'Access-Control-Allow-Origin': '*' },
			body: JSON.stringify(clusterDetails.clusters)
		};
	} catch (error) {
		return{
			statusCode: 500,
			headers: { 	'Access-Control-Allow-Origin': '*' },
			body: `An error occured: ${error}`
		}
	}

}
