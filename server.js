const axios = require('axios');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
Promise = require('bluebird');
mongoose.Promise = Promise;
require('dotenv').load();
const session = require('express-session');


let signedIn = false;

app.use(cors());

app.use(express.static(path.join(__dirname, 'front-end/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(session({secret: "discopuppy"}));
app.use(session({
    secret: "discopuppy",
    name: "cookie_name",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("app server listening on" + port);
});


const CONNECTION_STRING = process.env.DB;

// used to create test batch of events
/*
i = 1;
for (i = 1; i < 26; i++) {
    let testEvent = {
        "title": "",
        "description": "",
        "location": "",
        "time": "7:00pm",
        "date": "2018-12-14",
        "interested": [],
        "going": []
    }
    testEvent.title = "Test Event " + i;
    testEvent.description = "Test description for " + testEvent.title;
    testEvent.location = "Test Location";
    if (i < 10) {
        testEvent.date = "2018-12-" + i;
    } else {
        testEvent.date = "2018-12-" + i;
    }

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('events');
        collection.insertOne(testEvent);
    });
}
*/



// Delete Old Events Feature
/*
let today = new Date();

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    let dbo = db.db("jive-database");
    let collection = dbo.collection('events');
    collection.find().toArray(function(err, result) {
        let todayTs = today.getTime();
        let i = 0;
        for (i = 0; i < result.length; i++) {
            let dateTs = (new Date(result[i].date)).getTime(); // changes date to timestamp
            if (todayTs > dateTs) {
                try {
                    collection.deleteOne({_id: ObjectId(result[i]._id)});
                    console.log('successfully deleted event: ' + result[i].title);
                } catch (err) {
                    console.log(err)
                }
            }
        }
    });
});
*/


// HTTP Requests

app.get('/getSignedInVar', (req, res) => {
    if (req.session.user) {
        res.send({message: "User is signed in", error: 0, signedIn: true})
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})
/*
app.post('/createEvent', (req, res) => {
    //res.set('Content-Type', 'text/json');

    let title = req.body.title;
    let location = req.body.location;
    let description = req.body.description;
    let time = req.body.time;
    let date = req.body.date;

    let eventObject = {
        "title": title,
        "description": description,
        "location": location,
        "time": time,
        "date": date,
        "interested": [],
        "going": []
    }

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('events');
        collection.insertOne(eventObject);
    });

    res.send({ title: title, location: location, description: description, time: time, date: date });

})
*/

app.post('/createUser', (req, res) => {

    let user = req.body.user;
    let password = req.body.password;

    let userObject = {
        "user": user,
        "password": password,
        "quizzes": []
    }

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('users');
        collection.findOne({user: user}, function(err, result) {
            if (result) {
                res.send({message: "User already exists", error: 1, signedIn: false});
            } else {
                collection.insertOne(userObject);
                signedIn = true;
                collection.findOne({user: user}, function(err, result) {
                    req.session.userId = result._id;
                    req.session.user = req.body.user;
                    //req.session.password = req.body.password;
                    res.send({message: "User successfully created", error: 0, signedIn: true});
                })
                
            }
        });
    });
})

app.post('/loginUser', (req, res) => {
    let user = req.body.user;
    let password = req.body.password;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('users');
        collection.findOne({user: user}, function(err, result) {
            if (result) {
                if (result.password === password) {
                    signedIn = true;
                    req.session.userId = result._id;
                    req.session.user = req.body.user;
                    req.session.password = req.body.password;
                    res.send({message: "Successfully signed in", error: 0, signedIn: true});
                } else {
                    res.send({message: "Password incorrect", error: 2, signedIn: false});
                }
            } else {
                //collection.insertOne(userObject);
                res.send({message: "User does not exist", error: 1, signedIn: false});
            }
        });
    });
})

app.post('/logout', (req, res) => {
    if (signedIn) {
        signedIn = false;
        req.session.destroy();
        res.send({message: "User has logged out", error: 0, signedIn: false});
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})




//let questionsArray = [];
let quizObject = {
    "teacher": "",
    "school": "",
    "numberOfQuestions": 0,
    "questionsArray": []
}
app.post('/createQuiz', (req, res) => {
    // need to push this quiz id into user's quizzes array
    
    let teacher = req.body.teacher;
    let school = req.body.school;
    let numberOfQuestions = req.body.numberOfQuestions;
    let array = []; /// for questionsArray below // push all questionsObjects into this

    quizObject.teacher = teacher;
    quizObject.school = school;
    quizObject.numberOfQuestions = numberOfQuestions;
    quizObject.questionsArray = array;
    console.log(quizObject);
    
    res.json({error: 0, message: "connected"});
})

app.post('/initQuestion', (req, res) => {
    // initializes question into quizObject
    let questionObject = {
        "number": null,
        "question": "",
        "answers": [],
        "correctAnswer": 0
    }
    quizObject.questionsArray.push(questionObject);
    console.log(quizObject);
    res.json({error: 0, message: "Question pushed"});
})

app.post('/editQuestion', (req, res) => {

    let number = req.body.number;
    let question = req.body.question;
    let type = req.body.type;
    let answers = req.body.answers;
    let correctAnswer = req.body.correctAnswer; // should be a number

    let questionObject = {
        "number": number,
        "question": question,
        "type": type,
        "answers": answers,
        "correctAnswer": correctAnswer
    }

    quizObject.questionsArray.push(questionObject);

    res.json({error: 0, message: "Question edited"});
})

app.post('/submitQuiz', (req, res) => {
    // insert quizObject into mongodb
})


module.exports = app;