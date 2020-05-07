import React, {Component} from 'react';
import LoginForm from './loginform';

class Login extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="container-fluid">
                <div className="row justify-content-center h-100">
                    <div className="col-md-4 bg-white rounded my-auto">
                        <div className="logo">
                            <span href="javascript:;" className="simple-text">
                                Attendance Tracker
                            </span>
                        </div>
                        <div className="row justify-content-center">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}
 
export default Login;