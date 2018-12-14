import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../style.css';
import Header from './Header';
import QuestionComponent from './QuestionComponent';
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

A good problem that I had to figure out, if it works, was the issue with trying
to pass values of Question Component back here, in order to, on submit, send
the proper data to the server then to the database. The way I fixed that, is to
do a server call here to initialize a new quiz object on the server, then
for every QuestionComponent rendered do a server call which pushes a new
question into that quiz object and edits it on every change to the component.



Do like with Event Poster and Interested and Going buttons. Only send this info to
server for conditionally rendering the question "type". The rest, you only have to 
do the server call creating the full Quiz Object when they click submit....

*/




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
        /*
        let i = 0;
        for (i = 0; i < numberOfQuestions; i++) {
            let quizObject = {

            };
        }
        */
        
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