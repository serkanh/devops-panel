import React, { Component } from "react";
import { getClusterDetail } from "./api/api";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  li: {
    width: 400
  }
});

class EcsClusterDetails extends Component {
  state = {
    clusterArn: null,
    clusterName: null,
    containerInstances: [],
    serviceDescriptions: []
  };

  async componentDidMount() {
    console.log(this.props.location.state);
    console.log(this.props.match.params);
    const { clusterArn } = this.props.location.state;
    const { clusterName } = this.props.match.params;
    const { containerInstances, serviceDescriptions } = await getClusterDetail(
      clusterName
    );
    this.setState({
      clusterName,
      clusterArn,
      containerInstances,
      serviceDescriptions
    });
  }

  render() {
    console.log(this.state);
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <ListSubheader component="div">
              {this.state.clusterName}
            </ListSubheader>
          </GridListTile>
          <ul>
            {this.state.containerInstances.map((item, index) => (
              <li className={classes.li} key={item.ec2InstanceId}>
                {item.ec2InstanceId}: {item.privateIp}
                {/* {item.ec2UserData} */}
              </li>
            ))}
          </ul>
        </GridList>
      </div>
    );
  }
}

export default withStyles(styles)(EcsClusterDetails);
