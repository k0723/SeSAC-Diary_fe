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

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // OAuth2PasswordRequestForm 요구사항에 맞춘 URL-encoded 폼 데이터 생성
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("grant_type", "password");

            const res = await axios.post(
                "/users/signin/",
                formData,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            if (res.status === 200) {
                alert(res.data.message);

                const accessToken = res.data.access_token;
                // 두 스토리지에 모두 저장
                window.localStorage.setItem("access_token", accessToken);
                window.sessionStorage.setItem("access_token", accessToken);
                // 전역 헤더 갱신
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

                // JWT 디코딩하여 user_id 저장
                try {
                    const base64Url = accessToken.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const decoded = JSON.parse(window.atob(base64));
                    const userId = decoded.user_id || decoded.sub;
                    if (userId) {
                        window.localStorage.setItem("user_id", String(userId));
                        window.sessionStorage.setItem("user_id", String(userId));
                    }
                } catch {
                    console.warn("JWT 디코딩 중 문제가 발생했습니다.");
                }

                navigate("/list");
            }
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            if (status === 401 || status === 404) {
                alert("로그인에 실패했습니다.\n" + err.response.data.detail);
            } else {
                alert("로그인에 실패했습니다.");
            }
            setUsername('');
            setPassword('');
            inputRef.current.focus();
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/oauth/google/login";
    };

    return (
        <>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    value={username}
                    onChange={changeUsername}
                    placeholder="이메일을 입력하세요."
                />
                <input
                    type="password"
                    value={password}
                    onChange={changePassword}
                    placeholder="패스워드를 입력하세요."
                />
                <button type="submit">로그인</button>
            </form>
            <hr />
            <button
                onClick={handleGoogleLogin}
                style={{ background: "#4285F4", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", marginTop: "10px" }}
            >
                Google 계정으로 로그인
            </button>
            <hr />
            <p style={{ marginTop: "20px" }}>
                아직 계정이 없으신가요?
                <Link
                    to="/userregform"
                    style={{ marginLeft: "10px", color: "#007bff", textDecoration: "none" }}
                >회원가입</Link>
            </p>
        </>
    );
}
