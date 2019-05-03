import React, { Component } from "react";
import { getClusterDetail } from "./api/api";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  card: {
    minWidth: 275
  }
});

class EcsClusterDetails extends Component {
  state = {
    clusterArn: null,
    clusterName: null,
    containerInstances: [],
    serviceDescriptions: [],
    expanded: null
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
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
    const { expanded } = this.state;
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <div className={classes.root}>
        <h3>{this.state.clusterName} Services</h3>
        {this.state.serviceDescriptions.map((service, index, arr) => (
          <Card className={classes.card} key={index}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {service.serviceName}
              </Typography>

              <Typography className={classes.pos} color="textSecondary">
                {service.loadBalancer.loadBalancerName ||
                  service.loadBalancer.albName}
              </Typography>
              <Typography component="p">
                Desired Count: {service.desiredCount}
                <br />
                Running Count: {service.runningCount}
                <br />
                Pending Count: {service.pendingCount}
                <br />
              </Typography>
              <br />
              <ExpansionPanel
                expanded={expanded === service.serviceName}
                onChange={this.handleChange(service.serviceName)}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    Task Definition
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    Task Definition Detail
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <ul>
                    {service.taskDefinition.taskDefinition.containerDefinitions.map(
                      (item, index, arr) => (
                        <li key={item.name}><h2>{item.name}</h2>
												{item.environment.map((e,index)=>(
													<p key={index}><b>{e.name}: </b> {e.value}</p>
												))}</li>
                      )
                    )}
                  </ul>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </CardContent>
          </Card>
          // 		// <li key={index}>{service.serviceName}</li>
          // 		<ExpansionPanel key={index} expanded={expanded === service.serviceName} onChange={this.handleChange(service.serviceName)}>
          //   <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          //     <Typography className={classes.heading}>{service.serviceName}</Typography>
          //     <Typography className={classes.secondaryHeading}>I am an expansion panel</Typography>
          //   </ExpansionPanelSummary>
          //   <ExpansionPanelDetails>
          //     <Typography>
          //       Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
          //       maximus est, id dignissim quam.
          //     </Typography>
          //   </ExpansionPanelDetails>
          // </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(EcsClusterDetails);
