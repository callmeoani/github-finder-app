import { Component } from  'react'

import {
  BrowserRouter,
  Routes,
  Route,


} from "react-router-dom";

import { Fragment } from 'react/cjs/react.production.min';
import axios from 'axios';

import './App.css';
import Navbar from './components/layouts/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layouts/Alert';
import About from './components/pages/About';

class App extends Component {

  state= {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  }

  //Search Github users
  searchUsers = async text => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

      this.setState({ users: res.data.items, loading: false });
  }

  //Get a single Github user 
  getUser = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`http//api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ user: res.data, loading: false });
  }

  // Get users repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`http//api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ repos: res.data, loading: false });
  }

  //Clear users from state
  clearUsers = () => {
        this.setState({ users: [], loading:  false })
  }

  //Set alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type }  });

    setTimeout(() => this.setState({alert: null }), 5000);
  }
  

  render(){
    const { loading, users, user, repos  } = this.state;

    return (
      <BrowserRouter>
        <div className="App">
        <Navbar  />
          <div className="container">
            <Alert alert={this.state.alert} />

            <Routes>
              <Route path="/" element={
                <Fragment>
                  <Search 
                    searchUsers={this.searchUsers} 
                    clearUsers={this.clearUsers} 
                    showClear={ users.length > 0 ? true: false } 
                    setAlert= {this.setAlert} />
                  <Users loading={loading} users={users} />
                </Fragment>
              } />
              <Route path='/about' element={<About />} />
              <Route path='/user/:login' element={
                <User 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos} 
                  user={user} 
                  repos={repos}
                  loading={loading} />
              } />
            </Routes>
           
          </div>
        </div>
      </BrowserRouter>
    );
  }
 
}

export default App;
