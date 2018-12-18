import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';



class ViewQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null
        }
    ///this.searchEvents = this.searchEvents.bind(this);
    }

    componentWillMount() {
        //console.log(this.props.object);
        this.setState(() => ({ title: this.props.object.title }))
    }

    

    render() {
        return (
            <div>
                {this.state.title !== null && this.state.title}
            </div>
        )

    }
}

export default ViewQuiz;