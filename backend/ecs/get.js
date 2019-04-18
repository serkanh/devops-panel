'use strict';
import ECS from 'aws-sdk/clients/ecs'

const ecs = new ECS({region:'us-east-1'})

export async function main(event, context) {
	try {
		let clusters = await ecs.listClusters().promise()
		let clusterDetails = await ecs.describeClusters({clusters:clusters.clusterArns}).promise()
		return {
			statusCode: 200,
			body: JSON.stringify(clusterDetails)
		};
	} catch (error) {
		return{
			statusCode: 500,
			body: `An error occured: ${error}`
		}
	}

}
