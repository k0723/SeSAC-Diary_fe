import "../App.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CalendarComponent from '../calendar';

const List = () => {
  const [diarys, setDiarys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [filteredDiarys, setFilteredDiarys] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const navigate = useNavigate();

  // Presigned URL 받아오기
  const getPresignedUrl = async (key) => {
    const token = window.localStorage.getItem("access_token");
    const res = await axios.get(
      `/diarys/download-url?file_key=${encodeURIComponent(key)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.download_url;
  };

  // 이미지 URL 가져오기
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

  // 로그인 체크
  useEffect(() => {
    const token = window.localStorage.getItem("access_token");
    if (!token) {
      alert("로그인 후 사용하세요.");
      navigate("/login");
    }
  }, [navigate]);

  // 일기 목록 가져오기 및 created_at 기준 정렬
  useEffect(() => {
    const token = window.localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get('/diarys/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      const sorted = response.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDiarys(sorted);
      setLoading(false);
    })
    .catch((err) => {
      console.error("일기장 데이터를 불러오는 데 실패했습니다:", err);
      setError('일기장 데이터를 불러오는 데 실패했습니다.');
      setLoading(false);
    });
  }, [navigate]);

  // 선택된 날짜(created_at)로 필터링
  useEffect(() => {
    if (selectedDate) {
      const filtered = diarys.filter(diary =>
        new Date(diary.created_at).toISOString().slice(0,10) === selectedDate
      );
      setFilteredDiarys(filtered);
    } else {
      setFilteredDiarys(diarys);
    }
  }, [selectedDate, diarys]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <CalendarComponent
        onDateSelect={setSelectedDate}
        attendDates={Array.from(new Set(
          diarys.map(d => new Date(d.created_at).toISOString().slice(0,10))
        ))}
      />

      <h2>
        {new Date(selectedDate).toLocaleDateString('ko-KR', {
          year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        })}의 일기
      </h2>
      
      {filteredDiarys.length === 0
        ? <p>오늘은 일기가 없습니다.</p>
        : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredDiarys.map(diary => (
              <li key={diary.id} style={{ marginBottom:20, borderBottom:"1px solid #ccc", paddingBottom:20 }}>
                <Link to={`/detail/${diary.id}`} style={{ textDecoration:"none", color:"inherit" }}>
                  <div style={{ display:"flex", gap:20 }}>
                    {diary.image && imageUrls[diary.id] && (
                      <img
                        src={imageUrls[diary.id]}
                        alt={diary.title}
                        style={{ width:200, objectFit:"cover", borderRadius:8 }}
                      />
                    )}
                    <div>
                      <h3>{diary.title}</h3>
                      <p style={{ maxWidth:500, color:"#555" }}>
                        {diary.content.length > 100
                          ? diary.content.slice(0,100) + "..."
                          : diary.content
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )
      }

      <button className="write-button" onClick={() => navigate("/regist")}>
        <span className="icon">✏️</span> 글쓰기
      </button>
    </div>
  );
};

export default List;
