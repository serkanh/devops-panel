import React, { Component } from "react";
import { getClusterDetail } from "./api/api";
class EcsClusterDetails extends Component {
  state = {
    clusterArn: null,
		clusterName: null,
		containerInstances:[]
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
    await this.setStateAsync({clusterName, clusterArn, containerInstances});
  }

  updateCluster = async (clusterName, clusterArn,clusterDetails) => {
    this.setState(() => ({ clusterName, clusterArn, clusterDetails }));
  };

  render() {
    console.log(this.state);
    // const clusterName = this.state.clusterName;
    // const clusterArn = this.state.clusterArn;
		// const { containerInstances, serviceDescriptions } =  this.state.clusterDetails;
	 // console.log(containerInstances)
    return (
      <div>
        <ul>
          <li>{this.state.clusterName}</li>
          <li>{this.state.clusterArn}</li>
        </ul>
				<ol>
					{this.state.containerInstances.map((item,index)=>(
						<li key='index'>{item.ec2InstanceId}</li>
					))}
				</ol>
      </div>
    );
  }
}

export default EcsClusterDetails;
