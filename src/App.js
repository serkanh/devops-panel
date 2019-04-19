import React, { Component } from "react";
import "./App.css";
import Ecs from "./Ecs";
import EcsClusterDetail from "./EcsClusterDetail";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
class App extends Component {
  render() {
    return (
			<Router>
      <div className="App">
        <header className="App-header" />

					<div>
						<Route exact path='/' render={()=>(
							<h1>Welcome </h1>
						)}></Route>
						<Route exact path='/ecs' component={Ecs}></Route>
						<Route path='/ecs/:clusterName' component={EcsClusterDetail}></Route>
					</div>

      </div>
			</Router>
    );
  }
}

export default App;
