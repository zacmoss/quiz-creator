import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import '../style.css';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import Footer from '../components/Footer';
import SignUpPage from '../components/SignUpPage';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import CreateQuizPage from '../components/CreateQuizPage';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

class AppRouter extends React.Component { // Client-Side Routing

    /*
    componentDidMount() {
        console.log('rendered');
        axios.get('/getSignedIn').then(function(result) {
            console.log(result.data);
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }
    */

    /* <Footer /> */

    render() {
        
        return (
            <Router history={history}>
                <div className="page_container">
                    <Switch>
                        <Route path="/" component={HomePage} exact={true} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/signUp" component={SignUpPage} />
                        <Route path="/studentDashboard" component={StudentDashboard} />
                        <Route path="/teacherDashboard" component={TeacherDashboard} />
                        <Route path="/createQuizPage" component={CreateQuizPage} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default AppRouter;