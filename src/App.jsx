import { BrowserRouter, Route, Routes, Link, Outlet, useNavigate } from "react-router-dom";
import List from "./diary/List";
import Regist from "./diary/Regist";
import Detail from "./diary/Detail";
import Login from "./user/Login";
import { useEffect, useState } from "react";
import DiaryUpload from "./diary/DiaryUpload"; 
import OauthHandler from "./user/OauthHandler";
import axios from "axios";

function Layout() {
    const [isLogin, setIsLogin] = useState(false);

    const handleLogout = async () => {
  try {
    await axios.post("http://localhost:8000/users/logout", {}, {
      withCredentials: true  // ✅ 쿠키 포함 필수
    });
    setIsLogin(false);  // ✅ 상태 초기화
    window.location.href = "/login";  // ✅ 또는 navigate("/login")
  } catch (err) {
    console.error("로그아웃 실패", err);
  }
};

    const navigate = useNavigate();
    
  useEffect(() => {
    axios.get("http://localhost:8000/users/me", {
        withCredentials: true  // ✅ 쿠키를 포함해서 요청
    })
    .then(() => {
        setIsLogin(true);   // ✅ 로그인 상태로 전환
    })
    .catch(() => {
        setIsLogin(false);  // ✅ 인증 실패 → 로그아웃 상태
    });
}, []);

    useEffect(() => {
        if(isLogin) {
            navigate("/list");
        } else {
            navigate("/login");
        }
    }, [isLogin]);

    return (
        <>
            <h1>새싹 일기장</h1>
            <hr />
            <header>
                {
                    isLogin ? (
                        <a onClick={handleLogout}>로그아웃</a>
                    ) : (
                        <Link to="/login">로그인</Link>
                    )
                }
            </header>
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