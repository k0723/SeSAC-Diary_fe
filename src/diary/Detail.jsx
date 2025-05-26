import "../App.css";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { diary_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showDownload, setShowDownload] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/diarys/${diary_id}`)
      .then(async (response) => {
        setEvent(response.data);
        setLoading(false);

        if (response.data.image) {
          const token = window.sessionStorage.getItem("access_token");
          const presignedRes = await axios.get(
            `http://localhost:8000/diarys/download-url?file_key=${encodeURIComponent(response.data.image)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setImageUrl(presignedRes.data.download_url);
        }
      })
      .catch(() => {
        setError('일기 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [diary_id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDownload(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>일기 정보가 없습니다.</p>;

  return (
    <div ref={containerRef}>
      <h2>{event.title}</h2>
      {imageUrl && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imageUrl}
            alt={event.title}
            style={{ width: '300px', cursor: 'pointer', display: 'block' }}
            onClick={() => setShowDownload(!showDownload)}
          />
          {showDownload && (
            <a
              href={imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#e0e0e0', // 연회색
                color: '#555555',           // 진한 회색
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                textDecoration: 'none',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            >
              이미지 다운로드
            </a>
          )}
        </div>
      )}
      <p><strong>내용:</strong> {event.content}</p>
      <p><strong>상태:</strong> {event.state}</p>
      <p><strong>일기 ID:</strong> {event.id}</p>
    </div>
  );
};

export default Detail;
