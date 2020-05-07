import config from './config';
import apiRouter from './api';
import express from 'express';

const server = express();
import './serverRender';

server.set('view engine', 'ejs');

server.use("/public", express.static('./public'));
server.use("/assets", express.static("./assets"));
server.use('/api', apiRouter);


server.get('/login', (req, res) => {
    res.render("login", {
        title: "Login: Attendance Tracking"
    });
});

server.get("/dashboard", function(req, res) {
    res.render("dashboard");
})

server.get("/chart", function(req, res) {
    res.render("chart");
})

server.get("/download", function(req, res) {
    res.render("download");
});

server.get("/verifycode", function(req, res) {
    res.render("verifycode");
});

server.get("/attendancetracking", (req, res) => {
    res.render("trackedattendance")
});

server.get("/logout", (req, res) => {
    app.locals = {}
    res.redirect("login");
});

server.get('/', (req, res) => {
    res.render("login", {
        title: "Login: Attendance Tracking"
    });
});

server.listen(config.port, config.host, () => {
    console.info("Express listening on port ", config.port); 
});