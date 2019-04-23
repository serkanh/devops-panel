"use strict";
import ECS from "aws-sdk/clients/ecs";
import Elbv2 from "aws-sdk/clients/elbv2";
import Elb from "aws-sdk/clients/elb";


const ecs = new ECS({ region: "us-east-1" });
const elbv2 = new Elbv2({ region: "us-east-1" });
const elb = new Elb({ region: "us-east-1" });

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
		let albArn = await elbv2.describeTargetGroups({TargetGroupArns:[targetGroupArn]}).promise()
		let alb = await elbv2.describeLoadBalancers({LoadBalancerArns:albArn.TargetGroups[0].LoadBalancerArns}).promise()
		//console.log(alb.LoadBalancers[0].DNSName)
		return alb.LoadBalancers[0].DNSName
	} catch (error) {
		throw new Error(error)
	}
}


async function getElbDnsName(elbObj){
	//console.log(elbObj)
	if (elbObj[0].loadBalancerName === undefined){
		return null
	}
  const name = elbObj[0].loadBalancerName
  try{
		let lbnames = [ `${name}` ]
	//	console.log(`lbnames ======> ${lbnames}`)

		let elasticlb = await elb.describeLoadBalancers({LoadBalancerNames:lbnames}).promise()
		//console.log(elasticlb)
		//console.log(elasticlb)
		return elasticlb.LoadBalancerDescriptions[0].DNSName;
	} catch (error) {
		console.log(error)
	}
}


/**
 *
 * @param {string} clusterName
 * @returns {Object[]}
 * TODO: Clean up this code to make it more readable. Perahps check conditions with switch statements
 * conditions to test whether there is a targetgroup, loadbalancer name or no alb/elb attached to the service
 */

async function describeServices(clusterName){
	try {
		const serviceNames = await listServices(clusterName)
		const serviceDescriptions = await ecs.describeServices({services:serviceNames, cluster:clusterName}).promise()
		return Promise.all(serviceDescriptions.services.map(async (service)=>({
			serviceName: service.serviceName,
			desiredCount: service.desiredCount,
			loadBalancer: {
				// TODO if target group available get the associated load balancer
				loadBalancerName:	service.loadBalancers[0] ? await getElbDnsName(service.loadBalancers) : `null`,
				containerPort:	service.loadBalancers[0].containerPort,
				albName:	service.loadBalancers[0].targetGroupArn ? await getTargetGroupAlb(service.loadBalancers[0].targetGroupArn) : `null`
			},
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
