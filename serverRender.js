import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './src/components/trackAForm';
// fetch the data from the api
import config from './config';
import Axios from 'axios';


Axios.get(`${config.serverUrl}/api/attendancetracking`)
    .then( (response) => {
        console.log(response);
    });