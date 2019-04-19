import React, { Component } from "react";

class EcsClusterDetails extends Component {
  state = {
    clusterArn: null,
    clusterName: null
  };

  componentDidMount() {
    console.log(this.props.location.state);
    console.log(this.props.match.params);
    const { clusterArn } = this.props.location.state;
    const { clusterName } = this.props.match.params;
    this.updateCluster(clusterName, clusterArn);
  }

  updateCluster = async (clusterName, clusterArn) => {
    this.setState(() => ({ clusterName, clusterArn }));
  };

  render() {
    console.log(this.state);
    const clusterName = this.state.clusterName;
    const clusterArn = this.state.clusterArn;
    console.log();
    return (
      <div>
        <ul>
          <li>{clusterName}</li>
          <li>{clusterArn}</li>
        </ul>
      </div>
    );
  }
}

export default EcsClusterDetails;
