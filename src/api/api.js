'use strict'
import axios from 'axios'

function handleError (error) {
  console.warn(error);
  return null;
}


export async function getClusters(){
	return axios.get('http://localhost:3000/ecs/')
				 .then(response=>response.data)
	       .catch(handleError)
}

export async function getClusterDetail(clusterName){
	return axios.get(`http://localhost:3000/ecs/${clusterName}/`)
				 .then(response=>response.data)
	       .catch(handleError)
}

/**
 *
 * @param {string} s3Url
 * @return {string} returns the body of s3 file
 */
export async function readS3file(s3Url) {
  try {
    const s3UrlRe = /^[sS]3:\/\/(.*?)\/(.*)/;
    const match = s3Url.match(s3UrlRe);
		const params = { Bucket: match[1], Key: match[2] };
		const file = await s3.getObject(params).promise()
		console.log(file.Body.toString())
  } catch (error) {
    throw new Error(error);
  }
}