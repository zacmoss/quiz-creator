import React from 'react';
//import ReactDOM from 'react-dom';
import axios from 'axios';
import '../style.css';
import Header from './Header';


/*
With this version

Question ids are generated at the server when they are created in db

We hit the server and db much less frequently, (i.e. for creation
only when submitting a quiz)

When clicking back during question creation, question objects previously
created were saved to the questionsArray, so all we're doing is going back 
through questionsArray and checking for them, then when clicking next we are
checking if there is a questionObject at the count in the questionsArray, if
there is then we populate the question with that data, else it would be an 
empty question...baller

*/



class CreateQuizNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizId: null,
            school: "",
            teacher: "",
            title: "",
            numberOfQuestions: 0,
            question: "",
            number: 1,
            type: "multiple",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            correctAnswer: "a",
            page: 0,
            lastPage: false,
            questionsArray: [],
        }
        this.nextClick = this.nextClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.createQuiz = this.createQuiz.bind(this);
        this.sendQuestion = this.sendQuestion.bind(this);
        this.initQuiz = this.initQuiz.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.submitQuiz = this.submitQuiz.bind(this);
        this.schoolHandler = this.schoolHandler.bind(this);
        this.teacherHandler = this.teacherHandler.bind(this);
        this.titleHandler = this.titleHandler.bind(this);
        this.numberOfQuestionsHandler = this.numberOfQuestionsHandler.bind(this);
        this.typeHandler = this.typeHandler.bind(this);
        this.questionHandler = this.questionHandler.bind(this);
        this.answerAHandler = this.answerAHandler.bind(this);
        this.answerBHandler = this.answerBHandler.bind(this);
        this.answerCHandler = this.answerCHandler.bind(this);
        this.answerDHandler = this.answerDHandler.bind(this);
        this.correctAnswerHandler = this.correctAnswerHandler.bind(this);
 
    }

    initQuiz(e) {
        e.preventDefault();
        let school = this.state.school;
        let teacher = this.state.teacher;
        let title = this.state.title;
        let numberOfQuestions = this.state.numberOfQuestions;
        let lastPage = false;
        if (numberOfQuestions == 1) {
            lastPage = true;
        }
        
        this.setState(() => ({
           school: school,
           teacher: teacher,
           title: title,
           numberOfQuestions: numberOfQuestions,
           page: 1,
           lastPage: lastPage
        }));
    }

    nextQuestion(e) {
        e.preventDefault();
        let page = this.state.page + 1;
        let number = this.state.number + 1;
        let lastPage;
        if (page == this.state.numberOfQuestions) {
            lastPage = true;
        }
        let questionObject = {
            question: this.state.question,
            type: this.state.type,
            answerA: this.state.answerA,
            answerB: this.state.answerB,
            answerC: this.state.answerC,
            answerD: this.state.answerD,
            correctAnswer: this.state.correctAnswer
        }
        
        let count = page - 1; // array count so 0, 1, 2... etc
        let questionsArray;

        if (this.state.questionsArray[count - 1]) {
            questionsArray = this.state.questionsArray;
            questionsArray[count - 1] = questionObject; // over writing previously saved questionObject
        } else {
            questionsArray = this.state.questionsArray.concat(questionObject);
        }
        

        // if this.state.questionsArray[page - 1] exists then populate with that data
        
        //let length = this.state.questionsArray.length;
        // if the next in the count already exists in the questionsArray then populate with that
        if (this.state.questionsArray[count]) {
            let questionObject = this.state.questionsArray[count]
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                questionsArray: questionsArray,
                question: questionObject.question,
                answerA: questionObject.answerA,
                answerB: questionObject.answerB,
                answerC: questionObject.answerC,
                answerD: questionObject.answerD,
                correctAnswer: questionObject.correctAnswer
            }));
        } else {
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                questionsArray: questionsArray,
                question: "",
                answerA: "",
                answerB: "",
                answerC: "",
                answerD: "",
                correctAnswer: "a"
            }));
        }
        //alert('clickity click');
    }

    backClick(e) {
        e.preventDefault();
        let page = this.state.page - 1;
        let number = this.state.number - 1;
        let lastPage = false;
        if (page == 0) {
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                question: "",
                answerA: "",
                answerB: "",
                answerC: "",
                answerD: "",
                correctAnswer: "a"
            }))
        } else {
            let count = page - 1;
            let questionObject = this.state.questionsArray[count];
            //let newQuestionsArray = 
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                question: questionObject.question,
                answerA: questionObject.answerA,
                answerB: questionObject.answerB,
                answerC: questionObject.answerC,
                answerD: questionObject.answerD,
                correctAnswer: questionObject.correctAnswer
            }))
        }
    }

    submitQuiz(e) {
        e.preventDefault();

        let questionObject = {
            question: this.state.question,
            type: this.state.type,
            answerA: this.state.answerA,
            answerB: this.state.answerB,
            answerC: this.state.answerC,
            answerD: this.state.answerD,
            correctAnswer: this.state.correctAnswer
        }

        let questionsArray = this.state.questionsArray.concat(questionObject);

        let data = {
            school: this.state.school,
            teacher: this.state.teacher,
            title: this.state.title,
            numberOfQuestions: this.state.numberOfQuestions,
            questionsArray: questionsArray
        }
        let self = this;
        axios.post('/submitQuiz', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
                //self.clearInputs(e);
                self.props.history.push('/dashboard');
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log(err);
        });
        //alert('submit dat quiz');
    }


    schoolHandler(e) {
        e.persist();
        this.setState(() => ({ school: e.target.value }));
    }
    teacherHandler(e) {
        e.persist();
        this.setState(() => ({ teacher: e.target.value }));
    }
    titleHandler(e) {
        e.persist();
        this.setState(() => ({ title: e.target.value }));
    }
    numberOfQuestionsHandler(e) {
        e.persist();
        this.setState(() => ({ numberOfQuestions: e.target.value }));
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

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Create a Quiz</h2>
                         
                        <div className="form">
                            <div className="form_inputs_container">
                                {this.state.page === 0 ?
                                    <form onSubmit={this.initQuiz}>
                                        <div>
                                            <input name="school" value={this.state.school} onChange={this.schoolHandler} placeholder="school" autoComplete="off" required></input>
                                        </div>
                                        <div>
                                            <input name="teacher" value={this.state.teacher} onChange={this.teacherHandler} placeholder="teacher's last name" autoComplete="off" required></input>
                                        </div>
                                        <div>
                                            <input name="title" value={this.state.title} onChange={this.titleHandler} placeholder="quiz title" autoComplete="off" required></input>
                                        </div>
                                        <div>
                                            <select name="numberOfQuestions" value={this.state.numberOfQuestions} onChange={this.numberOfQuestionsHandler}>
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
                                    </form>
                                :
                                    <div>
                                        {this.state.title}
                                        {this.state.school}
                                        {this.state.teacher}
                                        <div>
                                            <button onClick={this.backClick}>Back</button>
                                            <form onSubmit={this.state.lastPage ? this.submitQuiz : this.nextQuestion}>
                                                <div><label>Question {this.state.number}</label></div>
                                                <input name="question" value={this.state.question} placeholder="question" autoComplete="off" onChange={this.questionHandler}></input>
                                                <div>
                                                    <div><label>{this.state.submit}</label></div>
                                                    <div><label>a</label><input name="answerA" value={this.state.answerA} onChange={this.answerAHandler} autoComplete="off"></input></div>
                                                    <div><label>b</label><input name="answerB" value={this.state.answerB} onChange={this.answerBHandler} autoComplete="off"></input></div>
                                                    <div><label>c</label><input name="answerC" value={this.state.answerC} onChange={this.answerCHandler} autoComplete="off"></input></div>
                                                    <div><label>d</label><input name="answerD" value={this.state.answerD} onChange={this.answerDHandler} autoComplete="off"></input></div>
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
                                            
                                                <button className="form_button_container">{this.state.lastPage ? "Submit Quiz" : "Next"}</button>
                                                
                                            </form>

                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default CreateQuizNew;