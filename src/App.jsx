// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
  useLocation
} from "react-router-dom";
import axios from "axios";

import List from "./diary/List";
import Regist from "./diary/Regist";
import Detail from "./diary/Detail";
import Login from "./user/Login";
import UserRegForm from "./user/UserRegForm";
import ModifyDetail from "./diary/ModifyDetail";
import DiaryUpload from "./diary/DiaryUpload";
import CalendarComponent from "./calendar/index";
import OauthHandler from "./user/OauthHandler";
import CallbackPage from "./oauth/CallbackPage";

// Axios 전역 설정
axios.defaults.baseURL = "http://localhost:8000";
const token = window.localStorage.getItem("access_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function Layout() {
  const [isLogin, setIsLogin] = useState(
    !!window.localStorage.getItem("access_token")
  );
  const navigate = useNavigate();
  const location = useLocation();
  const alertShown = useRef(false);

  const handleLogout = () => {
  // 1) 로컬 스토리지 초기화
  window.localStorage.clear();
  // 2) 세션 스토리지 초기화
  window.sessionStorage.clear();
  // 3) axios 전역 헤더에서 Authorization 제거
  delete axios.defaults.headers.common["Authorization"];
  // 4) 로그인 상태 플래그 리셋
  setIsLogin(false);
  alertShown.current = false;
  // 5) 로그인 페이지로 이동
  navigate("/login");
};


  // 로그인 상태 업데이트
  useEffect(() => {
    setIsLogin(!!window.localStorage.getItem("access_token"));
  }, [location.pathname]);

  // 인증 기반 리다이렉트
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/oauth/google/callback") return;
    if (alertShown.current) {
      alertShown.current = false;
      return;
    }

    if (isLogin) {
      if (["/login", "/userregform"].includes(currentPath)) {
        alert("이미 로그인되어 있습니다. 일기 목록으로 이동합니다.");
        alertShown.current = true;
        navigate("/list");
      }
    } else {
      if (!["/login", "/userregform"].includes(currentPath)) {
        alert("로그인 후 사용하세요.");
        alertShown.current = true;
        navigate("/login");
      }
    }
  }, [isLogin, navigate, location.pathname]);

  return (
    <>
      <h1>새싹 일기장</h1>
      <header>
        {isLogin ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </header>
      <hr />
      <Outlet />
      <footer>
        <p>새싹 일기장 © 2025</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<List />} />
          <Route path="login" element={<Login />} />
          <Route path="userregform" element={<UserRegForm />} />
          <Route path="regist" element={<Regist />} />
          <Route path="list" element={<List />} />
          <Route path="detail/:diary_id" element={<Detail />} />
          <Route path="modifydetail/:diary_id" element={<ModifyDetail />} />
          <Route path="diary/upload" element={<DiaryUpload />} />
          <Route path="calendar" element={<CalendarComponent />} />
          <Route path="oauth" element={<OauthHandler />} />
          <Route path="oauth/callback" element={<CallbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
