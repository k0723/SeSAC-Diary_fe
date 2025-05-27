import { BrowserRouter, Route, Routes, Link, Outlet, useNavigate } from "react-router-dom";
import List from "./diary/List";
import Regist from "./diary/Regist";
import Detail from "./diary/Detail";
import Login from "./user/Login";
import { useEffect, useState } from "react";
import DiaryUpload from "./diary/DiaryUpload";
import OauthHandler from "./user/OauthHandler";
import UserRegForm from "./user/UserRegForm.jsx";
import axios from "axios";

function Layout({ isLogin, setIsLogin }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/users/me", {
      withCredentials: true
    })
    .then(() => setIsLogin(true))
    .catch(() => setIsLogin(false))
    .finally(() => setLoading(false)); // 초기 상태 확인 완료
  }, [setIsLogin]);

  useEffect(() => {
    if (loading) return;

    if (!isLogin && location.pathname !== "/login" && location.pathname !== "/userregform") {
      navigate("/login");
    } else if (isLogin && location.pathname === "/login") {
      navigate("/list");
    }
  }, [isLogin, loading, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/users/logout", {}, {
        withCredentials: true
      });
      setIsLogin(false);
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

  if (loading) return <p>로그인 상태 확인 중...</p>; // 초기 요청 중인 경우 로딩 표시

  return (
    <>
      <h1>새싹 일기장</h1>
      <hr />
      {location.pathname !== "/login" && (
        <header>
          {
            isLogin ? (
              <a onClick={handleLogout}>로그아웃</a>
            ) : (
              <Link to="/login">로그인</Link>
            )
          }
        </header>
      )}
      <main>
        <Outlet />
      </main>
      <footer>
        <p>새싹 일기장 © 2025</p>
      </footer>
    </>
  );
}


function App() {
    const [isLogin, setIsLogin] = useState(false);
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout isLogin={isLogin} setIsLogin={setIsLogin} />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/regist" element={<Regist />} />
                        <Route path="/list" element={<List />} />
                        <Route path="/detail/:diary_id" element={<Detail />} />
                        <Route path="/diary/upload" element={<DiaryUpload />} />
                        <Route path="/oauth" element={<OauthHandler setIsLogin={setIsLogin} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;