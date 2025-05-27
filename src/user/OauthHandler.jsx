import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OauthHandler({ setIsLogin }) {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/users/me", {
            withCredentials: true  // ✅ 쿠키 포함
        })
        .then((res) => {
            setIsLogin(true);      // ✅ 상태 전환
            navigate("/list");
        })
        .catch((err) => {
            console.error("로그인 실패", err);
            alert("소셜 로그인 실패. 다시 시도해주세요.");
            navigate("/login");    // ✅ 실패 시 로그인 페이지로
        });
    }, [navigate, setIsLogin]);

    return <div>로그인 처리 중...</div>;
}
// In your main app file or wherever your routes are defined
