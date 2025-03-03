import { useState } from "react";
import "../components/LoginModal.css";

const LoginModal = ({ onClose }) => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const Login = async () => {
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
    
            const data = await response.json();
            alert(data.message);
            if (response.ok) onClose();
        } catch (error) {
            console.error("Login failed:", error);
        }
    };    
    
    return (
        <div className="modal">
            <div className="modal-content">
                <strong>Login</strong>
                <input type="UserName" placeholder="UserName" value={username} onChange={(e) => setUserName(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={Login}>Login</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default LoginModal;
