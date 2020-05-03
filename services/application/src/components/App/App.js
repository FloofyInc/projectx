import React, { Component } from 'react';
import './App.css';

import { Link, Route, Switch, BrowserRouter, BrowserHistory } from 'react-router-dom';
import { Box, Heading, Grommet, Anchor, Header, Nav, Avatar, Text } from 'grommet';

import {Home, Login, Logout, Register, Loading, History} from 'Pages';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg:'',
            loading:true,
            isLoggedIn:false,
            email:''
        };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.setEmail = this.setEmail.bind(this);
    }

    login() {
        this.setState({isLoggedIn: true});
    }

    logout() {
        this.setState({isLoggedIn: false});
        //this.history.push('/');
    }

    setEmail(tag) {
        this.setState({email: tag});
    }

    componentDidMount() {
        console.log("component did mount");
        fetch('/api/checkToken', {
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                this.setState({
                    msg: "USER LOGGED IN!",
                    isLoggedIn:true,
                    loading:false
                });
                return res.json();
            } else {
                this.setState({
                    msg: "PLEASE LOGIN FIRST.",
                    isLoggedIn:false,
                    loading:false
                });
            }
        })
        .then(data => {
            if (data) {
                //console.log(data);
                this.setState({
                    email: data.email,
                    isAdmin: data.isAdmin
                });
            }
            
        }) 
        .catch(err => {
            console.error(err);
            alert('Error checking token');
        });
        
    }

    render() {
        var propsData = {
            login: this.login,
            logout:this.logout,
            setEmail: this.setEmail,
            email:this.state.email,
        };

        var content = this.state.loading ? <Loading /> :
            <Home data={propsData}/>

        return (
            
            
          <BrowserRouter history={BrowserHistory}>
                <Header background="dark-1" pad="medium">
                    <Box direction="row" align="center" gap="small">
                        <Avatar src='https://i.imgur.com/MdDx7M4.png' />
                        <Anchor color="white" href="/">
                        Cheena D'souza
                        </Anchor>
                    </Box>
                    <Nav direction="row">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Text color="accent-1" weight="bold">Home</Text>
                        </Link>
                        {!this.state.isLoggedIn ?
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <Text color="accent-1" weight="bold">Register</Text>
                            </Link>
                        :
                            <span></span>
                        }
                        {!this.state.isLoggedIn ?
                            
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Text color="accent-1" weight="bold">Login</Text>
                            </Link>
                        :
                            
                            <Link to="/logout" style={{ textDecoration: 'none' }}>
                                <Text color="accent-1" weight="bold">Logout</Text>
                            </Link>
                        }
                    </Nav>
                </Header>
                <Switch>
                    <Route exact path="/" component={() => 
                        content
                    }/>
                    <Route exact path="/login" component={() =>
                        <Login data={propsData}/>
                    }/>
                    <Route exact path="/logout" component={() =>
                        <Logout data={propsData}/>
                    }/>
                    <Route exact path="/register" component={() =>
                        <Register data={propsData}/>
                    }/>
                    }/>
                    <Route exact path="/history" component={() =>
                        <History data={propsData}/>
                    }/>
                    
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
