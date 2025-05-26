import "../App.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

const List = () => {
  const [diarys, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getPresignedUrl = async (key) => {
  const token = window.sessionStorage.getItem("access_token");
  const res = await axios.get(`http://localhost:8000/diarys/download-url?file_key=${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.download_url;
  };

  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchPresignedUrls = async () => {
      const urls = {};
      for (const diary of diarys) {
        if (diary.image) {
          urls[diary.id] = await getPresignedUrl(diary.image);
        }
      }
      setImageUrls(urls);
    };
    if (diarys.length > 0) fetchPresignedUrls();
  }, [diarys]);

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
        <ul style={{ listStyle: "none", padding: 0 }}>
        {diarys.map((diary) => (
          <li key={diary.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
            <Link to={`/detail/${diary.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                {diary.image && imageUrls[diary.id] && (
                  <img src={imageUrls[diary.id]} alt={diary.title} style={{ width: '200px', height: 'auto', objectFit: 'cover' }} />
                )}
                <div>
                  <h3>{diary.title}</h3>
                  <p style={{ maxWidth: "500px" }}>{diary.content}</p>
                </div>
              </div>
            </Link>
          </li>
          ))}
        </ul>

      )}
      <button onClick={() => navigate("/regist")}>일기 등록</button>
    </>
  );
};

export default List;