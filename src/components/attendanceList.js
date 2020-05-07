import React from 'react';

const getStudents = (students, status) => {
    const tableData = students.map( ({studentid, name, email, is_verified}) => (
                                    <tr key={studentid} >
                                        <td key={studentid}>{studentid}</td>
                                        <td key={name}>{name}</td>
                                        <td key={email}>{email}</td>
                                        <td key={is_verified}>{is_verified}</td>
                                    </tr>))
    return (
        (status === "400") ? Error : tableData
    );
}

const defaultRender = (
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
);

const Error = (
        <tr>
            <td>There </td>
            <td>was no class scheduled</td>
            <td>with the params</td>
            <td>specified</td>
        </tr>
    );

const AttendanceList = (props) => {
    return ( 
        <tbody>
            {(props.students.length != 0)
                ? getStudents(props.students, props.status)
                : Error
            }
        </tbody>
    );
}
 
export default AttendanceList;