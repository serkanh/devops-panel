'use strict'
import axios from 'axios'

function handleError (error) {
  console.warn(error);
  return null;
}


export async function getClusters(){
	return axios.get('http://localhost:3000/ecs/list')
				 .then(response=>response.data)
	       .catch(handleError)
}
