import React, {useState} from "react";

const Dashboard = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email',email,'Password:',password);
    };

    return (
        <div>
            <h1>Dashboard Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type = "text" value={email} onChange={handleEmailChange} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Dashboard;