import React from 'react';
import axios from 'axios';
import '../style.css';




class QuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.mode,
            quizId: this.props.quizId,
            school: "",
            teacher: "",
            title: "",
            number: this.props.number,
            numberOfQuestions: this.props.totalQuestions,
            questionId: null,
            question: "",
            type: "multiple",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            correctAnswer: "",
            lastPage: false
        }
    
        this.typeHandler = this.typeHandler.bind(this);
        this.questionHandler = this.questionHandler.bind(this);
        this.answerAHandler = this.answerAHandler.bind(this);
        this.answerBHandler = this.answerBHandler.bind(this);
        this.answerCHandler = this.answerCHandler.bind(this);
        this.answerDHandler = this.answerDHandler.bind(this);
        this.correctAnswerHandler = this.correctAnswerHandler.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.clearInputs = this.clearInputs.bind(this); 
        this.onSubmit = this.onSubmit.bind(this);
    }

    
    componentWillMount() {
        if (this.props.mode === "create") {
            let lastPage;
            if (this.state.number == this.state.numberOfQuestions) {
                lastPage = true;
            }
            this.setState(() => ({
                school: this.props.school,
                teacher: this.props.teacher,
                title: this.props.title,
                question: "",
                answerA: "",
                answerB: "",
                answerC: "",
                answerD: "",
                correctAnswer: "a",
                lastPage: lastPage
            }));
        } else {
            this.setState(() => ({
                quizId: this.props.object.quizId,
                questionId: this.props.object._id,
                question: this.props.object.question,
                answerA: this.props.object.answerA,
                answerB: this.props.object.answerB,
                answerC: this.props.object.answerC,
                answerD: this.props.object.answerD,
                correctAnswer: this.props.object.correctAnswer
            }));
        }
    }
    
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














    nextClick(e) {
        e.preventDefault();

        if (this.state.number === this.state.numberOfQuestions) {
            this.onSubmit(e);
            this.props.history.push('/dashboard');
        } else {
            let number = this.state.number + 1;
            let lastPage = false;
            if (number == this.state.numberOfQuestions) { //////////// had to do '==' here instead of '===' not sure why
                lastPage = true;
            }
            this.onSubmit(e);
            this.setState(() => ({ number: number, lastPage: lastPage }));
        }
    }

    backClick(e) {
        e.preventDefault();
        let number = this.state.number - 1;
        // page is now === to question number
        // remove question
        let data = {
            "questionNumber": number
        }
        axios.post('/deleteQuestion', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log("error: " + err);
        });
        
        // need to do server call for question's info at this page and set as values
        // clear array??? // no so if they click back in browser, q still there???
        //this.setState(() => ({ mode: "intro" }));
        this.setState(() => ({ number: number, lastPage: false }))
    }















    clearInputs(e) {
        this.setState(() => ({
            question: "",
            type: "multiple",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            correctAnswer: ""
        }))
    }
    
    onSubmit(e) {
        e.preventDefault();
        let self = this;
        if (this.state.mode === "edit") {
            let data = {
                quizId: this.state.quizId,
                questionId: this.state.questionId,
                question: this.state.question,
                type: this.state.type,
                answerA: this.state.answerA,
                answerB: this.state.answerB,
                answerC: this.state.answerC,
                answerD: this.state.answerD,
                correctAnswer: this.state.correctAnswer
            }
            axios.post('/editQuestion', data).then(function(response) {
                if (response.data.error === 0) {
                    alert(response.data.message);
                    self.props.onSubmit(e);
                } else {
                    alert(response.data.message);
                }
            }).catch(function(err) {
                console.log("error: " + err);
            });
            
        } else {
            // create question
            let questionObject = {
                quizId: this.state.quizId,
                question: this.state.question,
                type: this.state.type,
                answerA: this.state.answerA,
                answerB: this.state.answerB,
                answerC: this.state.answerC,
                answerD: this.state.answerD,
                correctAnswer: this.state.correctAnswer
            }
            axios.post('/pushQuestion', questionObject).then(function(response) {
                if (response.data.error === 0) {
                    //alert(response.data.message);
                    self.clearInputs(e);
                } else {
                    //alert(response.data.message);
                }
            }).catch(function(err) {
                console.log("error: " + err);
            });
            
        }
    }
    
    

    render() {
        return (
            <div key={this.state.number} className="question_container">
            <form onSubmit={this.state.mode === "create" ? this.nextClick : this.onSubmit}>
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
                
                {this.state.mode === "create" && <button className="form_button_container">{this.state.lastPage ? "Submit Quiz" : "Next"}</button>}
                {this.state.mode === "edit" && <button className="form_button_container">Save</button>}
            </form>
                {this.state.mode === "create" && <button className="form_button_container" onClick={this.goBack}>Back</button>}
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