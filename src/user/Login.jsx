import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        axios
            .post("http://localhost:8000/users/signin/", 
                formData,
                { 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true
                })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    // 메시지를 출력 -> 토큰을 저장 -> 일기장 목록으로 이동
                    navigate("/list");
                }
            })
            .catch(err => {
                console.log(err);
                if (err.status === 401 || err.status === 404) {
                    alert("로그인에 실패했습니다.\n" + err.response.data.detail);
                } else {
                    alert("로그인에 실패했습니다.");
                }
                setUsername('');
                setPassword('');
                inputRef.current.focus();
            });
    };

    // 구글 로그인 버튼 클릭 시 백엔드로 이동
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
            <hr />
            <p style={{ marginTop: "20px" }}>
                아직 계정이 없으신가요?
                <Link to="/userregform" style={{ marginLeft: "10px", color: "#007bff", textDecoration: "none" }}>회원가입</Link>
            </p>
        </>
    );
}