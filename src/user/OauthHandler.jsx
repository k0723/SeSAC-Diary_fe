import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const inputRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const changeUsername = e => setUsername(e.target.value);
    const changePassword = e => setPassword(e.target.value);

    const handleSubmit = e => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        axios.post("http://localhost:8000/users/signin/",
            formData,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                withCredentials: true  // 🔥 쿠키 허용!
            }
        )
        .then(res => {
            if (res.status === 200) {
                alert(res.data.message || "로그인 성공");
                navigate("/list");
            }
        })
        .catch(err => {
            console.log(err);
            if (err.response?.status === 401 || err.response?.status === 404) {
                alert("로그인에 실패했습니다.\n" + err.response.data.detail);
            } else {
                alert("로그인에 실패했습니다.");
            }
            setUsername('');
            setPassword('');
            inputRef.current.focus();
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/users/google/login";
    };

    return (
        <>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input ref={inputRef} type="text" value={username} onChange={changeUsername} placeholder="이메일을 입력하세요." />
                <input type="password" value={password} onChange={changePassword} placeholder="패스워드를 입력하세요." />
                <button type="submit">로그인</button>
            </form>
            <hr />
            <button onClick={handleGoogleLogin} style={{ background: "#4285F4", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", marginTop: "10px" }}>
                Google 계정으로 로그인
            </button>
        </>
    );
}
