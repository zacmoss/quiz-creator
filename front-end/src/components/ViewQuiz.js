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
                <div key={ele._id}>
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
                    <div onClick={() => self.editQuestion(ele, number)}>Edit Question</div>
                </div>
            )
        })
        return questionsRender;
    }

    render() {
        return (
            <div>
                {this.state.mode === "edit" ?
                    <div>
                        <QuestionComponent mode={"edit"} quizId={this.state.quizId} number={this.state.numberPassed} object={this.state.questionPassed} onSubmit={this.onSubmit}/>
                    </div>
                :
                    <div>
                        {this.state.title !== null && this.state.title}
                        {this.state.teacher !== null && this.state.teacher}
                        {this.state.school !== null && this.state.school}
                        {this.state.numberOfQuestions !== null && this.state.numberOfQuestions}
                        {console.log(this.state.questionsArray)}
                        {this.state.questionsRender}
                    </div>
                }
            </div>
        )

    }
}

export default ViewQuiz;