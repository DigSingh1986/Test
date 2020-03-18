import React from 'react';
import ReactDOM from "react-dom";
import { HashRouter, BrowserRouter, Router, Route, Link, Switch } from "react-router-dom";


import { PrivateRoute } from '../src/auth/_components';
import { LoginPage } from '../src/Components/LoginPage/LoginPage';
import SearchData  from '../src/Components/Search';
class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/" component={LoginPage} />
                {<PrivateRoute path='/Search' component={SearchData} />}
                
            </Switch>
        );
    }

}


export default Routes;