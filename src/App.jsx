import { BrowserRouter, Route, Routes, Link, Outlet, useNavigate } from "react-router-dom";
import List from "./event/List";
import Regist from "./event/Regist";
import Detail from "./event/Detail";
import Login from "./user/Login";
import { useEffect, useState } from "react";

function Layout() {
    const [isLogin, setIsLogin] = useState(false);

    const handleLogout = () => {
        window.sessionStorage.removeItem("access_token");
        setIsLogin(false);
    };

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = window.sessionStorage.getItem("access_token");
        if (token) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    });

    useEffect(() => {
        if(isLogin) {
            navigate("/list");
        } else {
            navigate("/login");
        }
    }, [isLogin]);

    return (
        <>
            <h1>이벤트 관리 시스템</h1>
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
                <p>이벤트 관리 시스템 © 2023</p>
            </footer>
        </>
    );
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/regist" element={<Regist />} />
                        <Route path="/list" element={<List />} />
                        <Route path="/detail/:event_id" element={<Detail />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;