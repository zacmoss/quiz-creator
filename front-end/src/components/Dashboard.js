import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: null,
            quizzesArray: []
        }
        //this.searchEvents = this.searchEvents.bind(this);
    }

    componentWillMount() {
        let self = this;
        axios.get('/getUserData').then(function(result) {
            //alert(result.data.type);
            let type = result.data.type;
            let userId = result.data.userId;
            let array = result.data.array;
            console.log(array);
            let renderArray = array.map(function(ele) {
                return (
                    <div key={ele.quizId} onClick={() => self.clickQuiz(ele.quizId)}>{ele.title}</div>
                );
            });
            self.setState(() => ({ userType: type, quizzesArray: renderArray }));
        }).catch(function(err) {
            console.log(err);
        })
    }

    clickQuiz(quizId) {
        alert(quizId);
    }

    render() {
        return (
            <div>
                { this.state.userType === "student" ? 
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <div>
                                <h2>Student Dashboard</h2>
                                <div>
                                    <p>Quiz 1</p>
                                    <p>Quiz 2</p>
                                    <p>Quiz 3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <Link className="td_link" to="/createQuizPage"><p className="td_button">Create Quiz</p></Link>
                            <div>
                                <h2>My Quizes</h2>
                                <div>
                                    {this.state.quizzesArray}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )

    }
}

export default Dashboard;