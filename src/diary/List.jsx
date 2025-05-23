import "../App.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

const List = () => {
  const [diarys, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.sessionStorage.getItem("access_token");
    console.log(token);
    if (!token) {
      alert("로그인 후 사용하세요.");
      navigate("/login");
    }
  });
  
  useEffect(() => {
    axios.get('http://localhost:8000/diarys/')
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('일기장 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h2>일기 목록</h2>
      {diarys.length === 0 ? (
        <p>일기가 없습니다.</p>
      ) : (
        <ul>
          {diarys.map((diary) => (
            <li key={diary.id} style={{ marginBottom: '20px' }}>
              <h3><Link to={`/detail/${diary.id}`}>{diary.title}</Link></h3>
              {diary.image && <img src={`http://localhost:8000/diarys/download/${diary.id}`} alt={diary.title} style={{ width: '200px' }} />}
              <p><strong>설명:</strong> {diary.description}</p>
              <p><strong>위치:</strong> {diary.location}</p>
              <p><strong>태그:</strong> {diary.tags}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/regist")}>이벤트 등록</button>
    </>
  );
};

export default List;