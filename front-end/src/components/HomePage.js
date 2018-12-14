import React from 'react';
import '../style.css';
//import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchComponent: true,
            cec: false,
            eventFeed: true,
            searchResults: false,
            array: undefined
        }
        //this.searchEvents = this.searchEvents.bind(this);
    }

    
    componentDidMount() {
        /*
        console.log('rendered');
        axios.get('/testGet').then(function(result) {
            console.log(result.data);
        }).catch(function(err) {
            console.log("error: " + err);
        })
        */
    }
    

    render() {
        return (
            <div>
                <Header />
                <div className="home_page_container">
                    <div className="row boxes_container">
                        <Link className="box" to="/studentDashboard" >
                            <span>Students</span>
                        </Link>
                        <Link className="box" to="/login" >
                            <span>Teachers</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    /* old render
    render() {
        return (
            <div>
                <Header />
                <div className="home_page_container">
                    <div className="row boxes_container">
                        <div className="box">
                            <span>Create a Quiz</span>
                        </div>
                        <div className="box">
                            <span>Take a Quiz</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    */
}

export default HomePage;