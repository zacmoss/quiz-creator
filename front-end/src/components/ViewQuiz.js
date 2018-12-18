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
            school: null,
            teacher: null,
            title: null,
            numberOfQuestions: null,
            questionsRender: [],
            questionPassed: null,
            numberPassed: null
        }
    ///this.searchEvents = this.searchEvents.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        let self = this;
        let array = this.props.object.questionsArray;
        let number = 0;
        let questionsRender = array.map(function(ele) {
            number ++;
            return (
                <div key={ele._id}>
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
        });
        this.setState(() => ({
            school: this.props.object.school,
            teacher: this.props.object.teacher,
            title: this.props.object.title,
            numberOfQuestions: this.props.object.numberOfQuestions,
            questionsRender: questionsRender
        }))
    }

    editQuestion(ele, number) {
        this.setState(() => ({ mode: "edit", questionPassed: ele, numberPassed: number }));
    }
    onSubmit(e) {
        e.preventDefault();
        alert('test');
        this.setState(() => ({ mode: "view", questionPassed: null, numberPassed: null }));
    }

    

    render() {
        return (
            <div>
                {this.state.mode === "edit" ?
                    <div>
                        <QuestionComponent number={this.state.numberPassed} object={this.state.questionPassed} onSubmit={this.onSubmit}/>
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