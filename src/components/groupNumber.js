import React, { Component } from 'react';

class GroupNumber extends Component {
    state = {}

    render() { 
        const optionGroups = this.props.groups.map( (item) => <option key={item} value={item}>{item}</option>);
        return ( 
            <select className="form-control" name="groupnumber" onChange={this.props.onGroupChange} >
                {optionGroups}
            </select>
         );
    }
}
 
export default GroupNumber;