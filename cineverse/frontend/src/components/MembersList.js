import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MembersList.css';

const MembersList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/accounts/api/users/');
                const usersData = await response.json();
                setUsers(usersData); // Assuming the response is now a direct array of user objects
                console.log(usersData); // Debugging line to check what's coming in
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="members-list-container">
            <h1 className="members-list-title">Members</h1>
            <ul className="members-list">
                {users.map(user => (
                    <li key={user.id}>
                        <Link to={`/profile/${user.username}`}>{user.username}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MembersList;
