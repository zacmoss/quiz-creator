import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import QuestionComponent from './QuestionComponent';
import { Link } from 'react-router-dom';



class ViewQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "view",
            quizId: null,
            school: null,
            teacher: null,
            title: null,
            numberOfQuestions: null,
            questionsRender: [],
            questionPassed: null,
            numberPassed: null
        }
    this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        let questionsRender = this.renderQuestions(this.props.object.questionsArray);
        this.setState(() => ({
            quizId: this.props.object.quizId,
            school: this.props.object.school,
            teacher: this.props.object.teacher,
            title: this.props.object.title,
            numberOfQuestions: this.props.object.numberOfQuestions,
            questionsRender: questionsRender
        }));
    }

    editQuestion(ele, number) {
        this.setState(() => ({ mode: "edit", questionPassed: ele, numberPassed: number }));
    }
    onSubmit(e) {
        e.persist();
        let self = this;
        let data = { "quizId": this.state.quizId };
        axios.post('/getQuizData', data).then(function(result) {
            let questionsRender = self.renderQuestions(result.data.quizObject.questionsArray);
            self.setState(() => ({
                teacher: result.data.quizObject.teacher,
                school: result.data.quizObject.school,
                title: result.data.quizObject.title,
                numberOfQuestions: result.data.quizObject.numberOfQuestions,
                questionsRender: questionsRender,
                mode: "view",
                questionPassed: null,
                numberPassed: null
            }));
        }).catch(function(err) {
            console.log(err);
        });
        //this.setState(() => ({ mode: "view", questionPassed: null, numberPassed: null }));
    }

    
    renderQuestions(questionsArray) {
        let self = this;
        let number = 0;
        let array = questionsArray;
        let questionsRender = array.map(function(ele) {
            number ++;
            return (
                <div key={ele._id} className="question_container">
                    
                    <div>{ele._id}</div>
                    <div>Question number {number}</div>
                    <div>{ele.question}</div>
                    <div>
                        <div>a {ele.answerA}</div>
                        <div>b {ele.answerB}</div>
                        <div>c {ele.answerC}</div>
                        <div>d {ele.answerD}</div>
                    </div>
                    <div>{ele.correctAnswer}</div>
                    <div className="form_button_container"><button onClick={() => self.editQuestion(ele, number)}>Edit Question</button></div>
                </div>
            )
            /* old render
            return (
                <div key={ele._id} className="question_container">
                    <div>Quiz Id : {ele.quizId}</div>
                    <div>{ele._id}</div>
                    <div>Question number {number}</div>
                    <div>{ele.question}</div>
                    <div>
                        <div>a {ele.answers.answerA}</div>
                        <div>b {ele.answers.answerB}</div>
                        <div>c {ele.answers.answerC}</div>
                        <div>d {ele.answers.answerD}</div>
                    </div>
                    <div>{ele.correctAnswer}</div>
                    <div className="form_button_container"><button onClick={() => self.editQuestion(ele, number)}>Edit Question</button></div>
                </div>
            )
            */
        })
        return questionsRender;
    }

    render() {
        return (
            <div className="form_page_container">
                <div className="form_container">
                    {this.state.title}
                    {this.state.mode === "edit" ?
                        <div className="form">
                            <div className="form_inputs_container">
                                <div>
                                    <QuestionComponent mode={"edit"} quizId={this.state.quizId} number={this.state.numberPassed} object={this.state.questionPassed} onSubmit={this.onSubmit}/>
                                </div>
                            </div>
                        </div>
                    :
                        <div className="form">
                            <div className="form_inputs_container">
                                <div>
                                    {this.state.title !== null && this.state.title}
                                    {this.state.teacher !== null && this.state.teacher}
                                    {this.state.school !== null && this.state.school}
                                    {this.state.numberOfQuestions !== null && this.state.numberOfQuestions}
                                    {console.log(this.state.questionsArray)}
                                    {this.state.questionsRender}
                                </div>
                            </div>
                        </div>
                    
                    }
                </div>
            </div>
        )

    }
}

export default ViewQuiz;