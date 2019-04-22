"use strict";
import ECS from "aws-sdk/clients/ecs";
import { list } from "postcss";

const ecs = new ECS({ region: "us-east-1" });

/**
 *
 * @param {string} clusterName
 * @returns {Array} cluster arn array
 */
async function listServices(clusterName) {
  try {
		let services = await ecs.listServices({cluster:clusterName}).promise()
		return services.serviceArns
  } catch (err) {
    throw new Error(err)
  }
}

/**
 *
 * @param {string} clusterName
 * @returns {Array} list of registered container instances
 */
async function listContainerInstances(clusterName){
	try {
		let containerInstances = await ecs.listContainerInstances({cluster:clusterName}).promise()
		return containerInstances.containerInstanceArns
	} catch (err) {
		throw new Error(err)
	}
}

export async function main(event, context) {
  const clusterName = event.pathParameters.name
	const services = await listServices(clusterName)
	const containerInstances = await listContainerInstances(clusterName)
	console.log(services)
	console.log(clusterName)
	console.log(containerInstances)
  try {
    let clusterArn =
      "arn:aws:ecs:us-east-1:174076265606:cluster/ContentPublishing_qa";
    let clusterDetails = await ecs
      .describeClusters({ clusters: [clusterArn] })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(clusterDetails)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `An error occured: ${error}`
    };
  }
}
