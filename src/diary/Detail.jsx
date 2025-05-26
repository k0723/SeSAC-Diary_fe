import "../App.css";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { diary_id } = useParams(); // URL 파라미터 이름을 diary_id로 맞추세요
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/diarys/${diary_id}`)
      .then(async (response) => {
        setEvent(response.data);
        setLoading(false);

        // presigned url로 이미지 가져오기
        if (response.data.image) {
          const token = window.sessionStorage.getItem("access_token");
          const presignedRes = await axios.get(
            `http://localhost:8000/diarys/download-url?file_key=${encodeURIComponent(response.data.image)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setImageUrl(presignedRes.data.download_url);
        }
      })
      .catch((err) => {
        setError('일기 정보를 불러오는 데 실패했습니다.');
        console.log(diary_id);
        setLoading(false);
      });
  }, [diary_id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>일기 정보가 없습니다.</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      {imageUrl && <img src={imageUrl} alt={event.title} style={{ width: '300px' }} />}
      <p><strong>내용:</strong> {event.content}</p>
      <p><strong>상태:</strong> {event.state}</p>
      <p><strong>일기 ID:</strong> {event.id}</p>
    </div>
  );
};

export default Detail;