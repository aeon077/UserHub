import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

//ROUTER STUFF
import {
    BrowserRouter as Router, //vs HashRouter which adds # to url. BrowserRouter is cleaner
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

//COMPONENTS
import {
    Header,
    UserPosts,
    UserTodos
} from './components';

//API 
import {
    getUsers,
    getPostsByUser,
    getTodosByUser
} from './api';

//AUTHORIZATION
import {
    getCurrentUser
} from './auth';

const App = () => {
    const [userList, setUserList] = useState([]);
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [userPosts, setUserPosts] = useState([]);
    const [userTodos, setUserTodos] = useState([]);

    //makes call to API
    useEffect(() => {
        console.log("useEffect related to current user");
        getUsers()
            .then(users => {
                //sets the api data to be on our state
                setUserList(users)
            })
            .catch(error => {
                console.error(error)
            });
    }, []); //empty array means it will only run once 
    //Array is list of dependencies. If something was in this array, and its state changed, the function would be called again.

    useEffect(() => {
        if (!currentUser) {
            setUserPosts([]);
            setUserTodos([]);
            return;
        }
        //if not current user, returns empty array
        getPostsByUser(currentUser.id)
            .then(posts => {
                setUserPosts(posts); //populates the current users posts
            })
            .catch(error => {
                console.error(error)
            });

        getTodosByUser(currentUser.id)
            .then(todos => {
                setUserTodos(todos); //populates the current users todos
            })
            .catch(error => {
                console.error(error)
            });
    }, [currentUser]); //currentUser array looks for a change in the state, and reruns the function

    // CONDITIONAL RENDERING
    // inside return, can only use JSX, no if/else, can user ternary
    //<> = shorthand for <React.Fragment>
    //If user renders header buttons with posts/todo routes OR if no user, redirect defaults to home page/root folder
    return (
        <Router>
            <div id="App">
                <Header
                    userList={userList}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser} />
                {
                    currentUser
                        ? <>
                            <Switch>
                                <Route path="/posts">
                                    <UserPosts
                                        userPosts={userPosts}
                                        currentUser={currentUser} />
                                </Route>
                                <Route path="/todos">
                                    <UserTodos
                                        userTodos={userTodos}
                                        currentUser={currentUser} />
                                </Route>
                                <Route exact path="/">
                                    <h2 style={{
                                        padding: ".5em"
                                    }}>Welcome, {currentUser.username}!</h2>
                                </Route>
                                <Redirect to="/" />
                            </Switch>
                        </>
                        : <>
                            <Switch>
                                <Route exact path="/">
                                    <h2 style={{
                                        padding: ".5em"
                                    }}>Please log in, above.</h2>
                                </Route>
                                <Redirect to="/" />
                            </Switch>
                        </>
                }
            </div>
        </Router>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);