import express from 'express';
import bodyParser from 'body-parser';
import assert from 'assert';
import config from '../config';
import {MongoClient} from 'mongodb';

const crypto = require('crypto');
const objectId = require("mongodb").ObjectId;
const router = express.Router();

router.use(bodyParser.json());

MongoClient.connect(config.url, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
     (err, db) => {
     assert.equal(null, err);
     var mdb = db.db(config.dbName);
 

// sign up method
router.post("/signup", (req, res) => {

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const query = { email: newUser.email }
    mdb.collection('user').findOne(query, (err, result) => {
        if (result == null) {
            mdb.collection('user').insertOne(newUser, (err, result) => {
                assert.equal(null, err);
                res.send({ code: 200, status: "Ok"});
            })
        } else {
            res.send({ code: 400, status: "Invalid Action",  description: "Email already in-use"})
        }
    })
})


router.post("/login", (req, res) => {
    const query = {
        email: req.body.email,
        password: req.body.password
    }
    mdb.collection('user').findOne(query, (err, result) => {

        if (result != null) {
            //generate verification code
            crypto.randomBytes(8, function(err, buffer) {
                 var verificationCode = buffer.toString('hex');
                 result.verificationCode = verificationCode
             });


             crypto.randomBytes(48, function(err, buffer) {
                 var token = buffer.toString('hex');

                 result.token = token
                 result.is_verified = false
                 collection.updateOne(query, { $set: result }, (err, result) => {
                     console.log("Item updated")
                 })
             });

            res.send({
                code: 200,
                status: "OK",
                description: "Valid User"
            });

            router.locals.useremail = query.email;
        } else {
            res.send({ code: 400, status: "User Not Found", description: "Email or Password is wrong"});
        }
    })
});

router.get('/attendancetracking', (req, res) => {
    var program = req.query.program;
    var group = req.query.group;
    if (group == 0) { group = 1;}
    var day = req.query.day;
    var slot = Number(req.query.slot);
    var roomnumber = req.query.roomNumber;
    var date = req.query.date;

    mdb.collection('schedule').aggregate([
        { $match: { "coursename": program } },
        { $unwind: "$groups" },
        { $match: { "groups.groupname": group } },
        { $unwind: "$groups.weeklessons" },
        { $match: { "groups.weeklessons.day": day } },
        { $unwind: "$groups.weeklessons.lessons" },
        { $match: { "groups.weeklessons.lessons.courseslot": slot } },
        {
            $project: {
                coursename: "$groups.weeklessons.lessons.coursename",
                instructor: "$groups.weeklessons.lessons.instructor",
                roomnumber: "$groups.weeklessons.lessons.roomnumber"
            }
        }
    ]).toArray(function(err, result) {
    
        assert.equal(null, err);
        if (result.length != 0) {
            mdb.collection('attendance')
            .find({ beaconid: roomnumber, slot: slot })
            .toArray(function(err, documents) {
                assert.equal(null, err);

                if (documents.length != 0) {
                    var students = [];
                    documents.forEach((item, index, array) => {
                        mdb.collection('user').findOne({ studentid: item.studentid }, function(err, record) {
                            assert.equal(null, err);
                            students.push(record);
                            if (index === array.length - 1) {
                                res.send({
                                    subject: result[0].coursename,
                                    students: students,
                                    code: 200 
                                });
                            }
                        })
                    })
                } else {
                    res.send({
                        subject: "",
                        students: [],
                        code: 204
                    });
                }

            })
        } else {
            res.send({
                subject: "",
                students: [],
                code: 400
            });
        }
    })
});

router.post("/attendancetracking", (req, res) => {
    const student = {
        studentid: req.body.studentid,
        datetime: req.body.datetime,
        beaconid: req.body.beaconid
    }
    mdb.collection('attendance').findOne(student, (err, result) => {
        if (result != null) {
            res.status(200).send()
        } else {
            mdb.collection('attendance').insertOne(student, (err, docs) => {
                res.status(200).send()
            })
        }
    })
});


// confirm verification code endpoint
router.post('/confirm_verification', (req, res) => {

    if (req.body.role != "student")
            res.status(403).send("unauthorized user")
    else 
        {    
            const query = {
                _id: objectId(req.body._id)
            }
            mdb.collection('user').findOne(query, (err, result) => {
                if(result.verificationCode != req.body.code){
                        res.status(403).send("incorrect code")
                    }
                    else{

                        // student account is verified
                        result.is_verified = true
                        mdb.collection('user').updateOne(query, {$set: result}, (err, result) => {
                            console.log("Item updated")
                        })
                        res.status(200).send()
                    }
            })
        }
})


// get verification code for a given user
router.post('/get_verification_info', (req, res) => {

    if (req.body.role != "doe_member")
            res.status(403).send("unauthorized user")
    else 
        {    
            const query = {
                _id: objectId(req.body._id)
            }
            mdb.collection('user').findOne(query, (err, result) => {
                if (result != null){
                    res.status(200).send(result.verificationCode)
                }
                else {
                    res.status(403).send("user not found")
                }
            })
        }
})


// get the list of unverified users
router.post('/get_unverified_students', (req, res) => {

    if (req.body.role != "doe_member")
            res.status(403).send("unauthorized user")
    else 
        {    
            const query = {
                role: "student",
                is_verified: false
            }
            mdb.collection('user').find(query).toArray((err, result) => {
                if (result != null){
                    students = []
                    result.forEach((item) => {
                        console.log(item)
                        students.push([item["_id"], item["username"]]);
                    })
                        res.status(200).send(students)
                }
                else {
                    res.status(403).send("user not found")
                }
            })
        }
})


});



export default router;