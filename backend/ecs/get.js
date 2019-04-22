"use strict";
import ECS from "aws-sdk/clients/ecs";
import elbv2 from "aws-sdk/clients/elbv2";
import { list } from "postcss";

const ecs = new ECS({ region: "us-east-1" });
const elb = new elbv2({ region: "us-east-1" });

/**
 *
 * @param {string} clusterName
 * @returns {Array} returns an array of service names
 */
async function listServices(clusterName) {
  try {
		let services = await ecs.listServices({cluster:clusterName}).promise()
		return services.serviceArns.map((service)=>service.split('/')[1])
  } catch (error) {
    throw new Error(error)
  }
}


/**
 *
 * @param {string} targetGroupArn
 * @return {Object}
 */
async function getTargetGroupAlb(targetGroupArn){
	try {
		let alb = await elb.describeTargetGroups({TargetGroupArns:[targetGroupArn]}).promise()
		//console.log(alb.TargetGroups[0])
		return alb.TargetGroups[0].LoadBalancerArns[0]
	} catch (error) {
		throw new Error(error)
	}
}



/**
 *
 * @param {string} clusterName
 * @returns {Object[]}
 * TODO: Find a way to be able to make async calls with ternary operator or Promise.all
 */

async function describeServices(clusterName){
	try {
		const serviceNames = await listServices(clusterName)
		const serviceDescriptions = await ecs.describeServices({services:serviceNames, cluster:clusterName}).promise()
		return Promise.all(serviceDescriptions.services.map(async (service)=>({
			desiredCount: service.desiredCount,
			loadBalancer: {
				// TODO if target group available get the associated load balancer
				loadBalancerName:	service.loadBalancers[0].loadBalancerName ? service.loadBalancers[0].loadBalancerName: `null`,
				containerPort:	service.loadBalancers[0].containerPort,
				targetGroup:	service.loadBalancers[0].targetGroupArn ? await getTargetGroupAlb(service.loadBalancers[0].targetGroupArn) : `null`
			},
			serviceName: service.serviceName,
		})))
	} catch (error) {
		throw new Error(error)
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
	} catch (error) {
		throw new Error(error)
	}
}

export async function main(event, context) {
  const clusterName = event.pathParameters.name
	const services = await listServices(clusterName)
	const serviceDescriptions = await describeServices(clusterName)
	const containerInstances = await listContainerInstances(clusterName)
	// console.log(services)
	// console.log(clusterName)
	// console.log(containerInstances)
	console.log(serviceDescriptions)
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
