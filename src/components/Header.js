import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import {
    storeCurrentUser,
    clearCurrentUser
} from '../auth';

import './Header.css';

const Header = ({
    currentUser,
    setCurrentUser,
    userList
}) => {
    const [selectedUser, setSelectedUser] = useState();

    useEffect(() => {
        setSelectedUser(userList[0]);
    }, [userList]);

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handleSelectChange = (event) => {
        const id = event.target.value
        //sets the value of of the user
        const user = userList.find(user => user.id == id);
        //gets the full user object with the user id
        setSelectedUser(user);
        //that full user object is what we want to have stored in our state
    }

    const handleUserLogin = (event) => {
        storeCurrentUser(selectedUser);
        setCurrentUser(selectedUser);
        //our selected user now becomes the logged in user
    }

    const handleUserLogout = (event) => {
        setSelectedUser(userList[0]);
        clearCurrentUser();
        setCurrentUser(null);
    }
    //NavLink is JSX for a href
    //links to access routes in index.js
    return (
        <header>
            <h1>Welcome to UserHub</h1>
            <form
                className="user-select"
                onSubmit={handleSubmit} >
                {   //conditinally render logout button only if there is a current user or reroutes to index to select a user, and asks to login
                    currentUser
                        ? <>
                            <NavLink to="/posts" activeClassName="current">POSTS</NavLink>
                            <NavLink to="/todos" activeClassName="current">TODOS</NavLink >
                            <button onClick={handleUserLogout}>LOG OUT, {currentUser.username}</button>
                        </>
                        : <>
                            <select onChange={handleSelectChange}>{
                                userList.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))
                            }</select>
                            <button onClick={handleUserLogin}>LOG IN</button>
                        </>
                }
            </form>
        </header>
    );
}

export default Header;