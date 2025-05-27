import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // 1) JWT 토큰만 access_token 키로 저장
      window.localStorage.setItem("access_token", token);
      console.log(token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 2) user_id만 별도 키로 저장
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        const userId = payload.user_id || payload.sub;
        if (userId) {
          window.localStorage.setItem("user_id", String(userId));
        }
      } catch(e) {
        console.log(e);
      }

      // 3) 쿼리스트링 제거하고 /list 로 이동
      navigate("/list", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <div>소셜 로그인 처리 중...</div>;
}
