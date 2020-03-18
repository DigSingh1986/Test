import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {MDBListGroup, MDBListGroupItem, MDBContainer, MDBBtn,MDBAlert } from 'mdbreact';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './login.css';
import { Link } from "react-router-dom";
import $ from 'jquery';
import { Circle } from 'react-preloaders';
class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ((localStorage.getItem('checked') !== undefined && localStorage.getItem('checked')===true) !== undefined ? localStorage.getItem('user'):""),
            password: ((localStorage.getItem('checked') !== undefined &&  localStorage.getItem('checked') === true)? localStorage.getItem('Password') : ""),
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ username: e.target.value});
    }
    
    handlePasswordChange(e) {
      
        this.setState({ password: e.target.value });

    }
    handleSubmit(e) {
      
        e.preventDefault();
       
        this.setState({ submitted: true });
        if (!(this.state.username && this.state.password)) {
            this.setState({ loading: false });
            return;
        }
        this.setState({ loading: true });
        var URL = 'https://swapi.co/api/people/?search=' + this.state.username;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(res => {
                if (res.count > 0) {
                   
                    if (res.results[0].birth_year === this.state.password) {
                        localStorage.setItem('user', this.state.username);
                        localStorage.setItem('Password', this.state.password);
                        if ($("#chkrem").is(":checked")) {
                            localStorage.setItem('checked', true);
                        }
                        else
                            localStorage.setItem('checked', false);
                        this.props.history.push("/Search");
                    }
                    else {
                        this.setState({ loading: false });
                        this.setState({ error: "Please enter valid password." });
                    }
                    
                }
                else {
                    this.setState({ loading: false });
                    this.setState({ error: "Please enter valid username and password." });
                }
                this.setState({ loading: false });
            })
       
            
    }

    handleOnChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleChangeButton = (e) => {
        this.props.setFieldValue('degreeLevel', e.currentTarget.value);
    }
    render() {
        const { username, password, submitted, error } = this.state;
 
        return (
            <section className="loginbg">
                {this.state.loading === true && <Circle color={'#005984'} bgColor={'rgba(255,255,255,0.8)'} customLoading={this.state.loading} />}
            <MDBContainer>
                <Grid item className="LoginColumn" lg={12} xs={12} sm={12}>
                <Grid className="logoContainer" lg={12} xs={12} sm={12}>
                            <a id="logo-container" href="#"  >Xebia Test</a>
			    </Grid>
                <Grid item lg={7} sm={7} xs={12}>
                <Paper elevation={1} className="loginPaper">
                <Typography component="h3" color="primary" variant="h3" className="Loginpagehead">Log into your account</Typography>
                <form name="form" onSubmit={this.handleSubmit} className="LoginForm">
                
               
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <TextField className="LoginTextFields"
                            id="username"
                            label="Enter user name *"
                            type="text"
                            name="username"
                            margin="normal"
                            variant="outlined" value={username} onChange={this.handleChange}
                            />
                        {submitted && !username &&
                            <div className="help-block">User name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        
                        <TextField className="LoginTextFields"
                            id="outlined-password-input"
                            label="Password *"
                            name="password" 
                            type="password"
                            autoComplete = 'newpassword'
                            margin="normal"
                                            variant="outlined" value={password} onChange={this.handlePasswordChange} 
                            />
                                            
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                    <FormControlLabel
                        control={
                            <Checkbox id="chkrem"
                            checked={this.state.checkedB}
                            onChange={this.handleOnChange('checkedB')}
                            value="checkedB"
                            color="primary"
                            />
                        }
                        label="Remember Me"
                        />
                    </div>
                    <div className="form-group" style={{position:'relative'}}>
                    <button variant="contained" color="primary" className="btn btn-primary loginboxbutton" disabled={this.state.loading}>
                    Login</button>
                       
                        </div>
                    {error &&
                    <MDBAlert color="danger" className="warningError">
                    {error}
                    </MDBAlert>                     
                    }
                </form>
                <MDBListGroup className="extralinks">
                   
                </MDBListGroup>
            </Paper>
            </Grid>
            
            </Grid>
            </MDBContainer>
            </section>
        );

    }
}

export {LoginPage}; 