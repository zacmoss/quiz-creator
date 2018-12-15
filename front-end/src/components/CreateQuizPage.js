import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../style.css';
import Header from './Header';
import QuestionComponent from './QuestionComponent';
import { runInThisContext } from 'vm';
//import { Link } from 'react-router-dom';

// max out at 20 questions for now
// have 3 default spaces for questions with + button for add question


/*

Discussion

This component has two "modes." It starts with questions about school and teacher.
On the next click it conditionally renders questions jsx and disappears the intro jsx.

I'm employing a similar strategy to the Event Poster project here. We are 
generating jsx inside a helper function depending on number of questions entered.
That jsx is then saved to the state questionsRender which is then rendered below.

On nextClick create a questionsArray in server
In QuestionComponent on every component render I'm sending it's initial
data to that server questionsArray
Then, on every change to that component I'm updating that questionsArray at
the server

(No longer the case here) A good problem that I had to figure out, if it works, was the issue with trying
to pass values of Question Component back here, in order to, on submit, send
the proper data to the server then to the database. The way I fixed that, is to
do a server call here to initialize a new quiz object on the server, then
for every QuestionComponent rendered do a server call which pushes a new
question into that quiz object and edits it on every change to the component.



Do like with Event Poster and Interested and Going buttons. Only send this info to
server for conditionally rendering the question "type". The rest, you only have to 
do the server call creating the full Quiz Object when they click submit....

The above is maybe too expensive...if we're making server call every time we toggle
a question's type then that's a lot of server calls....

W/e we'll do it like EP first.

Could always do a 'multiple choice only' quiz down the line if this is too expensive.

The big problem is having to conditionally render the answers part of the form from
the selection of type on a particular question edit. Also, we're running into the
classic issue of, if I make each question edit an individual component, we can't
pass data, like type if it was changed and answers, etc back to hoc...

So, we'll just do a multiply choice only quiz right now...

To solve, we could do a "page" that for each specific question edit, that way
we'll have it all in one component and access and submit all changes and data 
on each submit

If necessary, could solve the original problem with Redux perhaps. Or, could look
into the new Hooks feature....Maybe re-visit this after I've learned about Hooks 
better.

So, two versions we're looking at right now...First, do a 'multiple-choice-only' quiz.
And second, do a version where each question edit is a new "page" (would just re-
render a component which moves to the "next question" on submit)



We can try to do separate QuestionComponents, we have a prop of 'submit' that is saved
as state on this HOC on each QC, onSubmit of form from the HOC we change the state of 
'submit' to 'true.' Then, on each QC have a switch where, if props changes, we do
a server call which pushes this specific questionObject into the bigger quizObject. So,
quizObject would need to already exist in db, we can generate it on nextClick from HOC,
and we also need to pass the quizObject id to the child component so on server call it
has access to that id and can push questionObject into that specific quizObject.

The problem with this scenario now is that the props passed to the child component
is not being updated properly on submit....the child is not getting that change,
event with the lifecycle method I put in....If we want to do a 'one-page' form, we'll
have to just do a vanilla javascript file for that and use ajax requests to the server...



So, we're just gonna do a 'multi-page' form...

*/





class CreateQuizPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalQuestions: 0,
            quizId: null,
            school: null,
            teacher: null,
            title: "",
            page: 0,
            lastPage: false
        }
        //this.selectNumber = this.selectNumber.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.createQuiz = this.createQuiz.bind(this);
        this.sendQuestion = this.sendQuestion.bind(this);
 
    }

    /*
    selectNumber(e) {
        e.persist();
        this.setState(() => ({ totalQuestions: e.target.value }));
    }
    */

    nextClick(e) {
        e.preventDefault();

        if (this.state.lastPage) {
            this.sendQuestion(e);
            alert('form submitted');
        } else {
            let school;
            let teacher;
            let title;
            let totalQuestions;
            if (this.state.page === 0) {
                school = e.target.elements.school.value;
                teacher = e.target.elements.teacher.value;
                title = e.target.elements.title.value;
                totalQuestions = e.target.elements.numberOfQuestions.value;
            } else {
                school = this.state.school;
                teacher = this.state.teacher;
                title = this.state.title;
                totalQuestions = this.state.totalQuestions;
            }
            let page = this.state.page + 1;
            let lastPage = false;
            if (page == this.state.totalQuestions) { //////////// had to do '==' here instead of '===' not sure why
                lastPage = true;
            }
            if (this.state.page === 0) {
                this.createQuiz(e);
            } else {
                this.sendQuestion(e);
            }
            this.setState(() => ({ school: school, teacher: teacher, title: title, totalQuestions: totalQuestions, page: page, lastPage: lastPage }));
        }
    }

    backClick(e) {
        e.preventDefault();
        let page = this.state.page - 1;
        // need to do server call for question's info at this page and set as values
        // clear array??? // no so if they click back in browser, q still there???
        //this.setState(() => ({ mode: "intro" }));
        this.setState(() => ({ page: page, lastPage: false }))
    }

    createQuiz(e) {
        let self = this;
        let data = {
            "school": e.target.elements.school.value,
            "teacher": e.target.elements.teacher.value,
            "title": e.target.elements.title.value,
            "numberOfQuestions": e.target.elements.numberOfQuestions.value,
            "questionsArray": []
        }
        axios.post('/createQuiz', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
                self.setState({ quizId: response.data.quizId });
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log("error: " + err);
        });
    }

    sendQuestion(e) {
        if (this.state.page > 0) {
            //let school = this.state.school;
            //let teacher = this.state.teacher;
            /*
            let questionText = e.target.elements.question.value;
            let answerA = e.target.elements.answerA.value;
            let answerB = e.target.elements.answerB.value;
            let answerC = e.target.elements.answerC.value;
            let answerD = e.target.elements.answerD.value;
            */
            let answersObject = {
                "answerA": e.target.elements.answerA.value,
                "answerB": e.target.elements.answerB.value,
                'answerC': e.target.elements.answerC.value,
                "answerD": e.target.elements.answerD.value
            }
            //let correctAnswer = e.target.correctAnswer.value;
            let questionObject = {
                "quizId": this.state.quizId,
                "question": e.target.elements.question.value,
                "answers": answersObject,
                "correctAnswer": e.target.correctAnswer.value
            }
            //console.log(questionObject);
            
            axios.post('/pushQuestion', questionObject).then(function(response) {
                if (response.data.error === 0) {
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            }).catch(function(err) {
                console.log("error: " + err);
            });
            
           this.clearInputs(e);
        }
    }
    clearInputs(e) {
        e.target.elements.question.value = "";
        e.target.elements.answerA.value = "";
        e.target.elements.answerB.value = "";
        e.target.elements.answerC.value = "";
        e.target.elements.answerD.value = "";
        e.target.elements.correctAnswer.value = "a";
    }

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Create a Quiz</h2>
                         
                        <form className="form" onSubmit={this.nextClick}>
                            <div className="form_inputs_container">
                                {this.state.page === 0 ?
                                    <div>
                                        <div>
                                            <input name="school" placeholder="school" autoComplete="off" required></input>
                                        </div>
                                        <div>
                                            <input name="teacher" placeholder="teacher's last name" autoComplete="off" required></input>
                                        </div>
                                        <div>
                                            <input name="title" placeholder="quiz title" autoComplete="off" required></input>
                                        </div>
                                        <div>
                                            <select name="numberOfQuestions">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        <div className="form_button_container">
                                            <button>Next</button>
                                        </div>
                                    </div>
                                :
                                    <div>
                                        {this.state.school}
                                        {this.state.teacher}
                                        <div>
                                            <div className="question_container">
                                                <div><label>Question {this.state.page}</label></div>
                                                <input name="question" placeholder="question" autoComplete="off"></input>
                                                <div>
                                                    <div><label>Answers</label></div>
                                                    <div><label>a</label><input name="answerA"></input></div>
                                                    <div><label>b</label><input name="answerB"></input></div>
                                                    <div><label>c</label><input name="answerC"></input></div>
                                                    <div><label>d</label><input name="answerD"></input></div>
                                                    <div>
                                                        <div><label>Correct Answer</label></div>
                                                        <select name="correctAnswer">
                                                            <option value="a">a</option>
                                                            <option value="b">b</option>
                                                            <option value="c">c</option>
                                                            <option value="d">d</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_button_container">
                                            {this.state.lastPage ? <button>Submit</button> : <button>Next</button>}
                                        </div>
                                        <span onClick={this.backClick}>Go Back</span>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}



/* old component
class CreateQuizPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "intro",
            totalQuestions: 1,
            school: null,
            teacher: null,
            questionsRender: null
        }
        this.selectNumber = this.selectNumber.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    selectNumber(e) {
        e.persist();
        this.setState(() => ({ totalQuestions: e.target.value }));
    }

    nextClick(e) {
        e.preventDefault();
        let school = e.target.elements.school.value;
        let teacher = e.target.elements.teacher.value;
        let array = this.renderQuestions();
        this.setState(() => ({ mode: "questions", school: school, teacher: teacher, questionsRender: array }));
    }

    backClick(e) {
        e.preventDefault();
        // clear array??? // no so if they click back in browser, q still there???
        this.setState(() => ({ mode: "intro" }));
    }

    renderQuestions() {
        let numberOfQuestions = this.state.totalQuestions;
        let i = 0;
        let renderFunc = () => {
            let renderArray = [];
            for (i = 0; i < numberOfQuestions; i++) {
                let number = i + 1;
                
                let question = (
                    <div key={number} className="question_container">
                        <div><label>Question {number}</label></div>
                        <input name="question" placeholder="question" autoComplete="off"></input>
                        <div>
                            <div><label>Answers</label></div>
                            <div><label>a</label><input name="answerA"></input></div>
                            <div><label>b</label><input name="answerB"></input></div>
                            <div><label>c</label><input name="answerC"></input></div>
                            <div><label>d</label><input name="answerD"></input></div>
                            <div>
                                <div><label>Correct Answer</label></div>
                                <select name="correctAnswer" onChange={this.answerHandler} value={this.state.correctAnswer}>
                                    <option value="a">a</option>
                                    <option value="b">b</option>
                                    <option value="c">c</option>
                                    <option value="d">d</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
                
                renderArray.push(question);
            }
            return renderArray;
        }
        let render = renderFunc();
        return render;
    }

    // elements are (5 inputs / 1 select) (1 input button at end)
    onSubmit(e) {
        e.preventDefault();
        let length = this.state.questionsRender.length * 6;
        let i = 0;
        let quizArray = [];
        // for each question 5 inputs and 1 select
        // 1 input at end of e.target.elements
        console.log("test");
        console.log(length);
        let x = window.location 
        /*
        for (i = 0; i < length; i + 6) {
            // question is i
            // answers are (i + 1) to (i + 4)
            // correct answer is i + 5
            let question = e.target.elements[i].value;
            let answerA = e.target.elements[i + 1].value;
            let answerB = e.target.elements[i + 2].value;
            let answerC = e.target.elements[i + 3].value;
            let answerD = e.target.elements[i + 4].value;
            let correctAnswer = e.target.elements[i + 5].value;
            let questionObject = {
                "question": question,
                "answerA": answerA,
                "answerB": answerB,
                "answerC": answerC,
                "answerD": answerD,
                "correctAnswer": correctAnswer
            }
            quizArray.push(questionObject);
        }
        *//*
        
        
        console.log(quizArray);


        //console.log(e.target.elements);
        //console.log(e.target.elements[0].value);
        //console.log(numberOfQuestions);
        //console.log(this.state.questionsRender[1])
    }

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Create a Quiz</h2>
                        {this.state.mode === "intro" && 
                        <form className="form" onSubmit={this.nextClick}>
                            <div className="form_inputs_container">
                                <div>
                                    <input name="school" placeholder="school" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <input name="teacher" placeholder="teacher's last name" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <select onChange={this.selectNumber} value={this.state.totalQuestions}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div className="form_button_container">
                                    <button>Next</button>
                                </div>
                            </div>
                        </form>}
                        {this.state.mode === "questions" &&
                        <div>
                            <form className="form" onSubmit={this.onSubmit}>
                                <div className="form_inputs_container">
                                    {this.state.school}
                                    {this.state.teacher}
                                    <div>
                                        {this.state.questionsRender}
                                    </div>
                                    <div className="form_button_container">
                                        <button>Submit</button>
                                    </div>
                                </div>
                            </form>
                            <span onClick={this.backClick}>Go Back</span>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}
*/



/* old component
class CreateQuizPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "intro",
            totalQuestions: 1,
            school: null,
            teacher: null,
            questionsRender: null,
            questionsArray: []
        }
        // questionsArray should look like this questionsArray: [{}, {}, {}]
        this.selectNumber = this.selectNumber.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.typeHandler = this.typeHandler.bind(this);
        this.answerHandler = this.answerHandler.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    selectNumber(e) {
        e.persist();
        this.setState(() => ({ totalQuestions: e.target.value }));
    }

    // set the array which is to render questions form
    nextClick(e) {
        e.preventDefault();
        let school = e.target.elements.school.value;
        let teacher = e.target.elements.teacher.value;
        let totalQuestions = this.state.totalQuestions;
        // need to set an array here and save to questionsRender
        //this.setState(() => ({ mode: "questions"}))
        let array = this.renderQuestions();
        console.log(array);
        this.setState(() => ({ mode: "questions", school: school, teacher: teacher, questionsRender: array }));
    }

    
    backClick(e) {
        e.preventDefault();
        // clear array???
        this.setState(() => ({ mode: "intro" }));
    }

    typeHandler(val) {
        //e.persist();
        console.log(val);
        //console.log(e.currentTarget.name);
        //console.log(e.parentElement.name.value);
        //console.log(ReactDOM.findDOMNode(this).parentNode.getAttribute("name"))
        //console.log(ReactDOM.findDOMNode(this).parentElement);
        //this.setState(() => ({ type: e.target.value }));
    }
    answerHandler(e) {
        e.persist();
        this.setState(() => ({ answer: e.target.value }));
    }

    renderQuestions() {
        let numberOfQuestions = this.state.totalQuestions;
        let i = 0;
        let renderFunc = () => {
            let renderArray = [];
            for (i = 0; i < numberOfQuestions; i++) {
                let number = i + 1;
                
                let question = (
                    <div key={number} className="question_container">
                        <div><label>Question {number}</label></div>
                        <input name="question" placeholder="question" autoComplete="off"></input>
                        <div><label>Type of Question</label></div>
                        <select name="type" onChange={() => this.typeHandler("testa")}>
                            <option value="boolean">True / False</option>
                            <option value="multiple">Multiple Choice</option>
                            <option value="essay">Essay</option>
                        </select>
                        {this.state.type === "boolean" && 
                        <div>
                            <div><label>Answer</label></div>
                            <select name="correctAnswer" onChange={this.answerHandler}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>}
                        {this.state.type === "multiple" && 
                        <div>
                            <div><label>Answers</label></div>
                            <label>a</label><input></input>
                            <div>
                                <div><label>Answer</label></div>
                                <select name="correctAnswer" onChange={this.answerHandler} value={this.state.correctAnswer}>
                                    <option value="a">a</option>
                                    <option value="b">b</option>
                                    <option value="c">c</option>
                                    <option value="d">d</option>
                                </select>
                            </div>
                        </div>}
                    </div>
                );
                
                renderArray.push(question);
            }
            return renderArray;
        }
        let render = renderFunc();
        return render;
    }

    onSubmit(e) {
        e.preventDefault();
        let numberOfQuestions = this.state.questionsRender.length;
        console.log(numberOfQuestions);
        console.log(this.state.questionsRender[1])
        
        
    }

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Create a Quiz</h2>
                        {this.state.mode === "intro" && 
                        <form className="form" onSubmit={this.nextClick}>
                            <div className="form_inputs_container">
                                <div>
                                    <input name="school" placeholder="school" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <input name="teacher" placeholder="teacher's last name" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <select onChange={this.selectNumber} value={this.state.totalQuestions}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div className="form_button_container">
                                    <button>Next</button>
                                </div>
                            </div>
                        </form>}
                        {this.state.mode === "questions" &&
                        <div>
                            <form className="form" onSubmit={this.onSubmit}>
                                <div className="form_inputs_container">
                                    {this.state.school}
                                    {this.state.teacher}
                                    <div>
                                        {this.state.questionsRender}
                                    </div>
                                    <div className="form_button_container">
                                        <button>Submit</button>
                                    </div>
                                </div>
                            </form>
                            <span onClick={this.backClick}>Go Back</span>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}
*/




/* old component
class CreateQuizPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "intro",
            totalQuestions: 1,
            school: null,
            teacher: null,
            questionsRender: null,
            questionsArray: []
        }
        // questionsArray should look like this questionsArray: [{}, {}, {}]
        this.selectNumber = this.selectNumber.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
    }

    selectNumber(e) {
        e.persist();
        this.setState(() => ({ totalQuestions: e.target.value }));
    }
    nextClick(e) {
        e.preventDefault();
        let school = e.target.elements.school.value;
        let teacher = e.target.elements.teacher.value;
        let totalQuestions = this.state.totalQuestions;
        let array = this.renderQuestions();
        
        let data = {
            "school": school,
            "teacher": teacher,
            "numberOfQuestions": totalQuestions,
            "questions": []
        };

        let self = this;
        axios.post('/createQuiz', data).then(function(response) {
            if (response.data.error === 0) {
                let i = 0;
                for (i = 0; i < array.length; i++) {
                    let data;
                    // pushes every question into quizObject at the server
                    axios.post('/initQuestion', data).then(function(response) {
                        if (response.data.error === 0) {
                            alert(response.data.message);
                        } else {
                            alert(response.data.message);
                        }
                    }).catch(function(err) {
                        console.log("error: " + err);
                    });
                }
                self.setState(() => ({ mode: "questions", school: school, teacher: teacher, questionsRender: array }));
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log("error: " + err);
        });
    }
    backClick(e) {
        e.preventDefault();
        this.setState(() => ({ mode: "intro" }));
    }
    renderQuestions() {
        let numberOfQuestions = this.state.totalQuestions;
        let i = 0;
        let renderFunc = () => {
            let renderArray = [];
            for (i = 0; i < numberOfQuestions; i++) {
                let number = i + 1;
                let question = (<div key={number}><QuestionComponent number={number} /></div>);
                renderArray.push(question);
            }
            return renderArray;
        }
        let render = renderFunc();
        return render;
    }
    
    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Create a Quiz</h2>
                        {this.state.mode === "intro" && 
                        <form className="form" onSubmit={this.nextClick}>
                            <div className="form_inputs_container">
                                <div>
                                    <input name="school" placeholder="school" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <input name="teacher" placeholder="teacher's last name" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <select onChange={this.selectNumber} value={this.state.totalQuestions}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div className="form_button_container">
                                    <button>Next</button>
                                </div>
                            </div>
                        </form>}
                        {this.state.mode === "questions" &&
                        <div>
                            <form className="form" onSubmit={this.onSubmit}>
                                <div className="form_inputs_container">
                                    {this.state.school}
                                    {this.state.teacher}
                                    <div>
                                        {this.state.questionsRender}
                                    </div>
                                    <div className="form_button_container">
                                        <button>Submit</button>
                                    </div>
                                </div>
                            </form>
                            <span onClick={this.backClick}>Go Back</span>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
    
}
*/

export default CreateQuizPage;