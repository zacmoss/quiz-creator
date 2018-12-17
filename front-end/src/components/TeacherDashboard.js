import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';


// Should contain 'Create New Quiz' 'My Quizzes List'


class TeacherDashboard extends React.Component {

    componentDidMount() {
        axios.get('/getUserType').then(function(result) {
            alert(result.data.type);
        }).catch(function(err) {
            console.log(err);
        })
    }

    render() {
        return (
            <div>
                <Header />
                <div className="teacher_dashboard">
                    <Link className="td_link" to="/createQuizPage"><p className="td_button">Create Quiz</p></Link>
                    <div>
                        <h2>My Quizes</h2>
                        <div>
                            <p>Quiz 1</p>
                            <p>Quiz 2</p>
                            <p>Quiz 3</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default TeacherDashboard;