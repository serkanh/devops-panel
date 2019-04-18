'use strict'
import axios from 'axios'

function getClusters(){
	return axios.get('localhost:3001/ecs/list')
}

getClusters()
.then(data=>data)