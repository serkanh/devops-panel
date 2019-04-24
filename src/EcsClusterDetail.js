import React, { Component } from "react";
import { getClusterDetail } from "./api/api";
class EcsClusterDetails extends Component {
  state = {
    clusterArn: null,
		clusterName: null,
		containerInstances:[],
		serviceDescriptions: []
	};

	setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    console.log(this.props.location.state);
    console.log(this.props.match.params);
    const { clusterArn } = this.props.location.state;
    const { clusterName } = this.props.match.params;
		const {containerInstances,serviceDescriptions}  = await getClusterDetail(clusterName)
    await this.setStateAsync({clusterName, clusterArn, containerInstances,serviceDescriptions});
  }



  render() {
    console.log(this.state);
    return (
      <div>
        <ul>
          <li>{this.state.clusterName}</li>
          <li>{this.state.clusterArn}</li>
        </ul>
				<ul>
					{this.state.containerInstances.map((item,index)=>(
						<li key={item.ec2InstanceId}>
						{item.ec2InstanceId}:
						{item.privateIp}

						</li>

					))}
				</ul>

				<ul>
					{this.state.serviceDescriptions.map((item,index)=>(
						<li key={index}>{item.serviceName}:
						{item.loadBalancer.loadBalancerName || item.loadBalancer.albName}
						</li>
					))}
				</ul>

      </div>
    );
  }
}

export default EcsClusterDetails;
