import React, { Component } from 'react';
import StudyProgram from './studyProgram';
import GroupNumber from './groupNumber';
import Axios from 'axios';

import programs from '../programs.json';

class TrackAForm extends Component {
    state = { 
        program: "BS - Year 1",
        groups: programs["BS - Year 1"],
        group: "B19-01",
        day: "Monday",
        slot: "1",
        roomNum: "101",
        date: "2020-05-04"
     }
    
    handleProgram = (event) => {
        const program = event.target.value;
        this.setState({
            ...this.state,
            program,
            groups: programs[program]
        });
    }

    handleGroup = (event) => {
        const group = event.target.value;
        this.setState({
            ...this.state,
            group
        });
    }

    handleDay = (event) => {
        const day = event.target.value;
        this.setState({
            ...this.state,
            day
        });
    }

    handleSlot = (event) => {
        const slot = event.target.value;
        this.setState({
            ...this.state,
            slot
        });
    }

    handleRoom = (event) => {
        const roomNum = event.target.value;
        this.setState({
            ...this.state,
            roomNum
        });
    }
    
    handleDate = (event) => {
        const date = event.target.value;
        this.setState({
            ...this.state,
            date
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {program, group, day, slot, roomNum, date } = this.state;

        Axios.get(`/api/attendancetracking/?program=${program}&group=${group}&day=${day}&slot=${slot}&roomNumber=${roomNum}&date=${date}`)
        .then((response) => {
            const {students, subject, code } = response.data;
            this.props.submitted(subject, students, code);
            
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return ( 
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-md-2">
                        <div className="form-group">
                            <label>Study Program</label>
                            <StudyProgram onProgramChange={this.handleProgram} program={this.state.program} />
                        </div>
                    </div>
                    <div className="col-md-1">
                        <div className="form-group">
                            <label>Group #</label>
                            <GroupNumber groups={this.state.groups} onGroupChange={this.handleGroup} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Day</label>
                            <select className="form-control" name="day" value={this.state.day} onChange={this.handleDay} >
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Time slot</label>
                            <select className="form-control" name="slot" value={this.state.slot} onChange={this.handleSlot} >
                                <option value="1">9:00 - 10:30</option>
                                <option value="2">10:35 - 12:05</option>
                                <option value="3">12:10 - 13:40</option>
                                <option value="4">14:10 - 15:40</option>
                                <option value="5">15:45 - 17:15</option>
                                <option value="6">17:20 - 18:50</option>
                                <option value="7">18:55 - 20:25</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-1">
                        <div className="form-group">
                            <label>Room #</label>
                            <input className="form-control" name="room" type="text" value={this.state.roomNum} onChange={this.handleRoom} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Date</label>
                            <input className="form-control" id="e" name="date" type="date" value={this.state.date} onChange={this.handleDate} />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-info btn-fill pull-right">Retrieve</button>
                <div className="clearfix"></div>
            </form> 
        );
    }
}
 
export default TrackAForm;