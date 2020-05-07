import React, { Component } from 'react';

class StudyProgram extends Component {
    state = {}

    render() { 
        const programs = ["BS - Year 1", "BS - Year 2", "BS - Year 3", "BS - Year 4", "MS - Year 1", "MS - Year 2"];
        const optionPrograms = programs.map(item => <option key={item} value={item}>{item}</option>);
        return(
            <select className="form-control" name="studyprogram" value={this.props.program} onChange={this.props.onProgramChange} >
                {optionPrograms}
            </select>
         );
    }
}
 
export default StudyProgram;