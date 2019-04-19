import React, { Component } from "react";
import "./Ecs.css";
import { getClusters } from "./api/api";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

/**
 * TODO: If one of the clusters returning pending task count highlight that instance
 * @param {array} clusters
 */
function ClusterGrid ({ clusters })  {
  return (
    <ul className='popular-list'>
      {clusters.map(({ clusterName, registeredContainerInstancesCount,runningTasksCount,pendingTasksCount,clusterArn,activeServicesCount}, index) => (
        <li key={index} className='popular-item'>

					<Link to={{
					 	pathname: `/ecs/${clusterName}`,
					 	state: {
					 		clusterArn: clusterArn
					 	}
					 }} >
					 <div className='popular-rank'>{index + 1} - {clusterName}</div>
					 </Link>
          <ul className='space-list-items'>
					  <li>Active Service Count: {activeServicesCount} </li>
            <li>Registered Container Count: {registeredContainerInstancesCount}</li>
            <li>Running Tasks Count: {runningTasksCount}</li>
            <li>Pending Tasks Count: {pendingTasksCount}</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

ClusterGrid.propTypes = {
  clusters: PropTypes.array.isRequired,
}

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
				<ClusterGrid clusters={clusters} />
      </div>
    );
  }
}

export default Ecs;
