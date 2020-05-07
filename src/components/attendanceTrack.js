import React, { Component } from 'react';
import TrackAForm from './trackAForm';
import AttendanceList from './attendanceList';

class AttendanceTrack extends Component {
    state = { 
        students: [],
        subject: "",
        code: 200
     }

    submitClicked = (subject, students, code) => {
        this.setState({
            ...this.state,
            students, 
            subject,
            code
        })
    }

    render() {
        const style = {paddingTop: '0px', paddingRight: '15px', paddingBottom: '15px', paddingLeft: '15px' }
        return ( 
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-11">
                        <div className="card" id="card_id" style={style}>
                            <div className="header">
                                <h4 className="title">Retrieve Attendance List</h4>
                            </div>
                            <div className="content" >
                                <TrackAForm submitted={this.submitClicked} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="header">
                                <h4 className="title">
                                    {this.state.subject}
                                </h4>
                                <p className="category">Recorded Attendance list</p>
                            </div>
                            <div className="content table-responsive table-full-width">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Verified</th>
                                        </tr>
                                    </thead>
                                    <AttendanceList students={this.state.students} status={this.state.code} />
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default AttendanceTrack;