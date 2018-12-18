import React from 'react';
import axios from 'axios';
import '../style.css';




class QuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizId: this.props.object.quizId,
            number: this.props.number,
            _id: this.props.object._id,
            question: "",
            type: "multiple",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            correctAnswer: ""
        }
    
        this.typeHandler = this.typeHandler.bind(this);
        this.questionHandler = this.questionHandler.bind(this);
        this.answerAHandler = this.answerAHandler.bind(this);
        this.answerBHandler = this.answerBHandler.bind(this);
        this.answerCHandler = this.answerCHandler.bind(this);
        this.answerDHandler = this.answerDHandler.bind(this);
        this.correctAnswerHandler = this.correctAnswerHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    
    componentWillMount() {
        this.setState(() => ({
            question: this.props.object.question,
            answerA: this.props.object.answers.answerA,
            answerB: this.props.object.answers.answerB,
            answerC: this.props.object.answers.answerC,
            answerD: this.props.object.answers.answerD,
            correctAnswer: this.props.object.correctAnswer
        }))
    }

    /*
    componentWillReceiveProps() {
        alert("submit at child component");
    }

    // will this be called on state changes???
    componentDidMount() {
        let data = {
            "number": this.state.number,
            "question": this.state.question,
            "type": this.state.type,
            "answers": this.state.answers,
            "correctAnswer": this.state.correctAnswer
        }
        /*
        axios.post('/editQuestion', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log("error: " + err);
        });
        *//*
        
    }
    */

    
    typeHandler(e) {
        e.persist();
        this.setState(() => ({ type: e.target.value }));
    }
    questionHandler(e) {
        e.persist();
        this.setState(() => ({ question: e.target.value }));
    }
    answerAHandler(e) {
        e.persist();
        this.setState(() => ({ answerA: e.target.value }));
    }
    answerBHandler(e) {
        e.persist();
        this.setState(() => ({ answerB: e.target.value }));
    }
    answerCHandler(e) {
        e.persist();
        this.setState(() => ({ answerC: e.target.value }));
    }
    answerDHandler(e) {
        e.persist();
        this.setState(() => ({ answerD: e.target.value }));
    }
    correctAnswerHandler(e) {
        e.persist();
        this.setState(() => ({ correctAnswer: e.target.value }));
    }
    
    onSubmit(e) {
        e.preventDefault();
        
        this.props.onSubmit(e);
        //alert(this.state.answerA);
        // server call which edits and saves question to quiz
        // push back to viewQuiz....
    }
    
    

    render() {
        return (
            <div key={this.state.number} className="question_container">
                <div><label>Question {this.state.number}</label></div>
                <input name="question" value={this.state.question} placeholder="question" autoComplete="off" onChange={this.questionHandler}></input>
                <div>
                    <div><label>{this.state.submit}</label></div>
                    <div><label>a</label><input name="answerA" value={this.state.answerA} onChange={this.answerAHandler}></input></div>
                    <div><label>b</label><input name="answerB" value={this.state.answerB} onChange={this.answerBHandler}></input></div>
                    <div><label>c</label><input name="answerC" value={this.state.answerC} onChange={this.answerCHandler}></input></div>
                    <div><label>d</label><input name="answerD" value={this.state.answerD} onChange={this.answerDHandler}></input></div>
                    <div>
                        <div><label>Correct Answer</label></div>
                        <select name="correctAnswer" onChange={this.correctAnswerHandler} value={this.state.correctAnswer}>
                            <option value="a">a</option>
                            <option value="b">b</option>
                            <option value="c">c</option>
                            <option value="d">d</option>
                        </select>
                    </div>
                </div>
                <button onClick={this.onSubmit}>Save</button>
            </div>
        )
    }

}




/* old component
class QuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: this.props.number,
            question: "",
            type: "multiple",
            answers: [],
            correctAnswer: "true"
        }
    
        this.typeHandler = this.typeHandler.bind(this);
        this.answerHandler = this.answerHandler.bind(this);
    }

    // will this be called on state changes???
    componentDidMount() {
        let data = {
            "number": this.state.number,
            "question": this.state.question,
            "type": this.state.type,
            "answers": this.state.answers,
            "correctAnswer": this.state.correctAnswer
        }
        axios.post('/editQuestion', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log("error: " + err);
        });
        
    }

    typeHandler(e) {
        e.persist();
        this.setState(() => ({ type: e.target.value }));
    }
    answerHandler(e) {
        e.persist();
        this.setState(() => ({ answer: e.target.value }));
    }
    render() {
        return (
            <div className="question_container">
                <div><label>Question {this.state.number}</label></div>
                <input name="question1" placeholder="question" autoComplete="off"></input>
                <div><label>Type of Question</label></div>
                <select onChange={this.typeHandler} value={this.state.type}>
                    <option value="boolean">True / False</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="essay">Essay</option>
                </select>
                {this.state.type === "boolean" && 
                <div>
                    <div><label>Answer</label></div>
                    <select onChange={this.answerHandler} value={this.state.correctAnswer}>
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
                        <select onChange={this.answerHandler} value={this.state.correctAnswer}>
                            <option value="a">a</option>
                            <option value="b">b</option>
                            <option value="c">c</option>
                            <option value="d">d</option>
                        </select>
                    </div>
                </div>}
            </div>
        )
    }

}
*/

export default QuestionComponent;