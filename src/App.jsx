import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';
import axios from 'axios';
import List from './diary/List';
import Regist from './diary/Regist';
import Detail from './diary/Detail';
import ModifyDetail from './diary/ModifyDetail';
import DiaryUpload from './diary/DiaryUpload';
import CalendarComponent from './calendar';
import Login from './user/Login';
import UserRegForm from './user/UserRegForm';
import OauthHandler from './user/OauthHandler';

// Axios 기본 설정: 모든 요청에 쿠키 전송
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function Layout({ isLogin, setIsLogin }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const alertRef = useRef(false);

  // 초기 인증 상태 확인
  useEffect(() => {
    axios.get('/users/me')
      .then(() => setIsLogin(true))
      .catch(() => setIsLogin(false))
      .finally(() => setLoading(false));
  }, [setIsLogin]);

  // 로그인/비로그인 상태에 따른 리다이렉션
  useEffect(() => {
    if (loading) return;
    const path = location.pathname;
    if (path === '/oauth') return; // OAuth 처리 중에는 스킵

    if (isLogin) {
      if (['/login', '/userregform'].includes(path) && !alertRef.current) {
        alert('이미 로그인되어 있습니다. 일기 목록으로 이동합니다.');
        alertRef.current = true;
        navigate('/list');
      }
    } else {
      const openPaths = ['/', '/login', '/userregform'];
      if (!openPaths.includes(path) && !alertRef.current) {
        alert('로그인 후 사용하세요.');
        alertRef.current = true;
        navigate('/login');
      }
    }
  }, [isLogin, loading, location.pathname, navigate]);

  // 로그아웃 처리
  const handleLogout = () => {
    axios.post('/users/logout')
      .then(() => {
        setIsLogin(false);
        alertRef.current = false;
        navigate('/login');
      })
      .catch(err => console.error('로그아웃 실패', err));
  };

  if (loading) return <p>로그인 상태 확인 중…</p>;

  return (
    <>
      <h1>새싹 일기장</h1>
      <header>
        {isLogin
          ? <button onClick={handleLogout}>로그아웃</button>
          : <Link to="/login">로그인</Link>
        }
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
  const [isLogin, setIsLogin] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
          <Route index element={<List />} />
          <Route path="login" element={<Login />} />
          <Route path="userregform" element={<UserRegForm />} />
          <Route path="regist" element={<Regist />} />
          <Route path="list" element={<List />} />
          <Route path="detail/:diary_id" element={<Detail />} />
          <Route path="modifydetail/:diary_id" element={<ModifyDetail />} />
          <Route path="diary/upload" element={<DiaryUpload />} />
          <Route path="calendar" element={<CalendarComponent />} />
          <Route path="oauth" element={<OauthHandler setIsLogin={setIsLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
