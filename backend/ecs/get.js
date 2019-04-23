"use strict";
import ECS from "aws-sdk/clients/ecs";
import ELBV2 from "aws-sdk/clients/elbv2";
import ELB from "aws-sdk/clients/elb";
import EC2 from "aws-sdk/clients/ec2";

const ecs = new ECS({ region: "us-east-1" });
const elbv2 = new ELBV2({ region: "us-east-1" });
const elb = new ELB({ region: "us-east-1" });
const ec2 = new EC2({ region: "us-east-1" });
/**
 *
 * @param {string} clusterName
 * @returns {Array} returns an array of service names
 */
async function listServices(clusterName) {
  try {
    let services = await ecs.listServices({ cluster: clusterName }).promise();
    return services.serviceArns.map(service => service.split("/")[1]);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 *
 * @param {string} targetGroupArn
 * @return {string} alb dns name
 */
async function getTargetGroupAlb(targetGroupArn) {
  if (targetGroupArn === undefined) {
    return null;
  }
  try {
    let albArn = await elbv2
      .describeTargetGroups({ TargetGroupArns: [targetGroupArn] })
      .promise();
    let alb = await elbv2
      .describeLoadBalancers({
        LoadBalancerArns: albArn.TargetGroups[0].LoadBalancerArns
      })
      .promise();

    return alb.LoadBalancers[0].DNSName;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 *
 * @param {Object} elbObj
 * @return {string} elb dns name
 */
async function getElbDnsName(elbObj) {
  if (elbObj[0].loadBalancerName === undefined) {
    return null;
  }
  try {
    let elasticlb = await elb
      .describeLoadBalancers({
        LoadBalancerNames: [elbObj[0].loadBalancerName]
      })
      .promise();
    return elasticlb.LoadBalancerDescriptions[0].DNSName;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {string} clusterName
 * @returns {Object[]}
 * TODO: Clean up this code to make it more readable. Perahps check conditions with switch statements
 * conditions to test whether there is a targetgroup, loadbalancer name or no alb/elb attached to the service
 */

async function describeServices(clusterName) {
  try {
    const serviceNames = await listServices(clusterName);
    const serviceDescriptions = await ecs
      .describeServices({ services: serviceNames, cluster: clusterName })
      .promise();
    return Promise.all(
      serviceDescriptions.services.map(async service => ({
        serviceName: service.serviceName,
        desiredCount: service.desiredCount,
        createdAt: service.createdAt,
        runningCount: service.runningCount,
				pendingCount: service.pendingCount,
				//Check if there are any elb/alb if there is none return null
        loadBalancer:
          service.loadBalancers.length > 1
            ? {
                loadBalancerName: service.loadBalancers[0]
                  ? await getElbDnsName(service.loadBalancers)
                  : `null`,
                containerPort: service.loadBalancers[0].containerPort
                  ? service.loadBalancers[0].containerPort
                  : `null`,
                albName: service.loadBalancers[0].targetGroupArn
                  ? await getTargetGroupAlb(
                      service.loadBalancers[0].targetGroupArn
                    )
                  : `null`
              }
            : `null`
      }))
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function getEc2PrivateIp(instanceId) {
  const privateIp = await ec2
    .describeInstances({ InstanceIds: [instanceId] })
    .promise();
  return privateIp.Reservations[0].Instances[0].NetworkInterfaces[0]
    .PrivateIpAddress;
}

/**
 *
 * @param {string} clusterName
 * @returns {Array} list of registered container instances
 */
async function listContainerInstances(clusterName) {
  try {
    const containerInstances = await ecs
      .listContainerInstances({ cluster: clusterName })
      .promise();
    //console.log(containerInstances.containerInstanceArns)
    const containerInstanceDesc = await ecs
      .describeContainerInstances({
        cluster: clusterName,
        containerInstances: containerInstances.containerInstanceArns
      })
      .promise();
    const containerInstancesWithIps = Promise.all(
      containerInstanceDesc.containerInstances.map(async el => {
        console.log(`test ${el.ec2InstanceId}`);
        const additional_info = {
          privateIp: await getEc2PrivateIp(el.ec2InstanceId),
          clusterName: clusterName
        };
        return Object.assign(el, additional_info);
      })
    );
    return containerInstancesWithIps;
  } catch (error) {
    throw new Error(error);
  }
}

export async function main(event, context) {
  const clusterName = event.pathParameters.name;
  const services = await listServices(clusterName);
  const serviceDescriptions = await describeServices(clusterName);
  console.log(serviceDescriptions);
  const containerInstances = await listContainerInstances(clusterName);
  console.log(containerInstances);
  const combined = {
    containerInstances,
    serviceDescriptions
  };
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(combined)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `An error occured: ${error}`
    };
  }
}
