import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
//import { Link } from 'react-router-dom';


class StudentDashboard extends React.Component {

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

export default StudentDashboard;