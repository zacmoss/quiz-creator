import React from 'react';
import axios from 'axios';
import '../style.css';

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

export default QuestionComponent;