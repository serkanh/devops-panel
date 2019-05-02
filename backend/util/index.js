export function getAgName(arr) {
	let item =  arr.filter(item => item.Key === "aws:autoscaling:groupName")
	return item[0].Value
}
