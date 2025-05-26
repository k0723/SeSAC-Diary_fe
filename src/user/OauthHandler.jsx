import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OauthHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) {
            window.sessionStorage.setItem("access_token", token);
            navigate("/list");
        } else {
            alert("로그인에 실패했습니다.");
            navigate("/");
        }
    }, [location, navigate]);

    return <div>로그인 처리 중...</div>;
}

// In your main app file or wherever your routes are defined
