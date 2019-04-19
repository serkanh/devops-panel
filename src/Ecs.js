import React, { Component } from "react";
import "./Ecs.css";
import { getClusters } from "./api/api";

class Ecs extends Component {
  state = {
    clusters: []
  };

  componentDidMount() {
    console.log("component did mount", this.state);
    this.updateClusters();
  }

  updateClusters = async () => {
    const clusters = await getClusters();
    this.setState(() => ({ clusters }));
  };

  render() {
    const clusters = this.state.clusters;
    console.log(this.state.clusters);
    return (
      <div className="Ecs-grid">
				{clusters.map((item, index, arr) =>
					<li key={index}>{item.clusterName} - {item.registeredContainerInstancesCount} </li>
				)}
      </div>
    );
  }
}

export default Ecs;
