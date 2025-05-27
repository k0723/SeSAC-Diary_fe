// src/oauth/CallbackPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CallbackPage() {
  const { search, href } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);

    // 백엔드에서 보내는 파라미터 키가 token인지 access_token인지 모두 시도
    const token = params.get('token') || params.get('access_token');
    let userId;

    if (token) {
      // JWT 페이로드를 디코딩해서 user_id(sub 또는 custom claim) 꺼내기
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        userId = payload.user_id || payload.sub;
      } catch (e) {
        console.error("JWT 디코딩 중 오류:", e);
      }
    }

    if (token && userId) {
      // 1) 토큰만 저장
      window.localStorage.setItem("access_token", token);
      window.sessionStorage.setItem("access_token", token);
      // 2) user_id 따로 저장
      window.localStorage.setItem("user_id", String(userId));
      window.sessionStorage.setItem("user_id", String(userId));
      // 3) axios 전역 헤더 갱신
      // (만약 여기서 전역 설정이 아직 안 되어 있으면)
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("Google Login: token,", token);
      console.log("Google Login: user_id,", userId);
      navigate("/list", { replace: true });
    } else {
      console.error("Google Login: 토큰 또는 user_id 누락:", href);
      navigate("/login", { replace: true });
    }
  }, [search, href, navigate]);

  return <div>Google 로그인 처리 중…</div>;
}
