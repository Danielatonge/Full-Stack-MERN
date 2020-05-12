import express from 'express';
import bodyParser from 'body-parser';
import assert from 'assert';
import config from '../config';
import {MongoClient} from 'mongodb';
//import TokenGenerator from 'uuid-token-generator';

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
            // crypto.randomBytes(8, function(err, buffer) {
            //      var verificationCode = buffer.toString('hex');
            //      result.verificationCode = verificationCode
            //  });


            //  crypto.randomBytes(48, function(err, buffer) {
            //      var token = buffer.toString('hex');

            //      result.token = token
            //      result.is_verified = false
            //      collection.updateOne(query, { $set: result }, (err, result) => {
            //          console.log("Item updated")
            //      })
            //  });

            res.send({
                code: 200,
                status: "OK",
                description: "Valid User"
            });
            
            //router.locals.useremail = query.email;
        } else {
            res.send({ code: 400, status: "User Not Found", description: "Email or Password is wrong"});
        }
    })
});

function maptoslot(ctime){
    let datetime = new Date(ctime)
    const hour = datetime.getHours() - 3;
    const minute = datetime.getMinutes();
    const second = datetime.getSeconds();
    const time = new Date().setHours(hour,minute,second);

    const timearray = [ new Date().setHours(9,0,0), new Date().setHours(10,30,0),
        new Date().setHours(10,35,0), new Date().setHours(12,5,0),
        new Date().setHours(12,10,0), new Date().setHours(13,40,0),
        new Date().setHours(14,10,0), new Date().setHours(15,40,0),
        new Date().setHours(15,45,0), new Date().setHours(17,15,0),
        new Date().setHours(17,20,0), new Date().setHours(18,50,0),
        new Date().setHours(18,55,0), new Date().setHours(20,25,0)];

    let slot = 0;
    if (time >= timearray[0] && time <= timearray[1]) { slot = 1; } else 
    if (time >= timearray[2] && time <= timearray[3]) { slot = 2; } else
    if (time >= timearray[4] && time <= timearray[5]) { slot = 3; } else 
    if (time >= timearray[6] && time <= timearray[7]) { slot = 4; } else 
    if (time >= timearray[8] && time <= timearray[9]) { slot = 5; } else 
    if (time >= timearray[10] && time <= timearray[11]) { slot = 6; }
    return slot;
}

router.get('/attendancetracking', (req, res) => {
    let datetime = req.query.datetime;
    let roomnumber = parseInt(req.query.roomNumber);
    const slot = maptoslot(datetime);
    const dateobject = new Date(datetime);
    const day = dateobject.toLocaleString('en-us', {weekday: 'long'});
    const date = dateobject.getDate();
    let month = dateobject.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = dateobject.getFullYear();
    const datestring = `${date}/${month}/${year}`;
    
    mdb.collection('schedule').aggregate([
        { $unwind: "$groups" },
        { $unwind: "$groups.weeklessons" },
        { $match : { "groups.weeklessons.day": day}},
        { $unwind: "$groups.weeklessons.lessons" },
        { $match: { "groups.weeklessons.lessons.courseslot": slot, "groups.weeklessons.lessons.roomnumber": roomnumber} },
        { $project :
                    {
                        coursename : "$groups.weeklessons.lessons.coursename",
                        instructor : "$groups.weeklessons.lessons.instructor",
                        roomnumber : "$groups.weeklessons.lessons.roomnumber"
                    }
        }
        ]).toArray(function(err, result) {
        assert.equal(null, err);
        if (result.length != 0) {
            mdb.collection('attendance')
            .find({ beaconid: roomnumber.toString(), slot: slot, date: datestring})
            .toArray(function(err, documents) {
                assert.equal(null, err);
                
                if (documents.length != 0) {
                    var students = [];
                    documents.forEach((item, index, array) => {
                        mdb.collection('user').findOne({ token: item.token }, function(err, record) {
                            assert.equal(null, err);
                            students.push(record);
                            if (index === array.length - 1) {
                                console.log(students);
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
    const datetime = req.body.datetime;
    const slot = maptoslot(datetime);
    const dateobject = new Date(datetime);
    const date = dateobject.getDate();
    const month = dateobject.getMonth();
    const year = dateobject.getFullYear();
    const datestring = `${date}/${month}/${year}`;

    const student = {
        slot: slot,
        date: datestring,
        beaconid: req.body.beaconid,
        token: req.headers["token"]
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