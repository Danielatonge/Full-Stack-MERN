import React, { Component } from 'react';

class LoginForm extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="col-md-10 login-form">
                <form method="POST" action="/login" className="form-signin">
                    <label htmlFor="inputEmail" className="sr-only">IUEmail address</label>
                    <input type="email" id="inputEmail" name="email" className="form-control rounded-0" placeholder="Email address" required="" autoFocus="" />
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input type="password" name="password" id="inputPassword" className="form-control rounded-0" placeholder="Password" required="" />
                    <button className="btn btn-sm btn-primary btn-block login-btn" type="submit">Login</button>
                </form>
            </div> 
        );
    }
}


export default LoginForm;