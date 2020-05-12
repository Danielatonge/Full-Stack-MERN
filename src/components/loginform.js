import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Axios from 'axios';
import AttendanceTrack from './attendanceTrack';


class LoginForm extends Component {
    state = {
        email: "",
        password: "",
        redirect: false
    };

    handleEmail = (event) => {
        const email = event.target.value;
        this.setState({
            ...this.state,
            email
        });
    }

    handlePassword = (event) => {
        const password = event.target.value;
        this.setState({
            ...this.state,
            password
        })
    }

    handleSubmit = (event) => {

        Axios.post('/api/login', {
            email: this.state.email,
            password: this.state.password
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.code === 200) {
                this.setState({
                    ...this.state,
                    redirect: true
                });
                window.location.replace("/attendancetracking");
            }
        })
        event.preventDefault();
    }
    render() { 
        return ( <div className="col-md-10 login-form">
                    <form onSubmit={this.handleSubmit} className="form-signin">
                        <label htmlFor="inputEmail" className="sr-only">IUEmail address</label>
                        <input type="email" id="inputEmail" name="email" className="form-control rounded-0" placeholder="Email address" value={this.state.email} onChange={this.handleEmail} required="" />
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input type="password" name="password" id="inputPassword" className="form-control rounded-0" placeholder="Password" value={this.state.password} onChange={this.handlePassword} required="" />
                        <button className="btn btn-sm btn-primary btn-block login-btn" type="submit">Login</button>
                    </form>
                 </div>
        );
    }
}


export default LoginForm;