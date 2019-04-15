import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state={
            loginData:{
                username: null,
                signedIn: false,
            }
        };
    }

    confirmUser(){
        fetch('/users')
            .then(response=>{
                return response.text();
            })
            .then(data=>{
                this.setState({loginData:{
                    username: data,
                    signedIn: true,
                    }
                });
            });
    }
    signedInUserData=(username, signedIn)=>{
        this.setState({loginData:{
            username: username,
            signedIn: signedIn,
            }
        });
    };
    LogOut=()=>{
        fetch('/users/logout')
            .then(data=>{return data.text()})
            .then(()=>this.signedInUserData(undefined, false))
    };

    render() {
        return (
            <div>
                <Router>
                    <Link to='/'>Home</Link>
                    <Link to='/login'>Log In</Link>
                    <Link to='/signup'>Sign Up</Link>
                    <Link to='/logout'>Log Out</Link>

                    <Route path="/login" component={LogIn}/>
                    <Route path="/signup" component={NewUser}/>
                    <Route path="/logout" component={LogOut}/>
                </Router>
            </div>
        );
    }
}

export default HomePage;