import React, { Component } from 'react';
import Axios from 'axios';


class TrackAForm extends Component {
    state = { 
        slot: "1",
        roomNum: "101",
        date: "2020-04-20"
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
        const slotarray = ["09:00", "10:35", "12:10", "14:10", "15:45", "17:20", "18:55"];
        const {slot, roomNum, date } = this.state;
        const time = slotarray[parseInt(slot)-1];
        const datetime = `${date}T${time}:00.000Z`;
        Axios.get(`/api/attendancetracking/?roomNumber=${roomNum}&datetime=${datetime}`)
        .then((response) => {
            console.log(response.data.students);
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Room #</label>
                            <input className="form-control" name="room" type="text" value={this.state.roomNum} onChange={this.handleRoom} />
                        </div>
                    </div>
                    <div className="col-md-4">
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