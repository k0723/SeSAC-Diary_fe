import "../App.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const s3client = axios.create();
delete s3client.defaults.headers.common["Authorization"];

export default function Regist() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    state: true,
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleChangeFile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleStateChange = (e) => {
    setForm({
      ...form,
      state: e.target.value === "public",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.sessionStorage.getItem("access_token");

    try {
      let image_url = "";

      if (image) {
        const ext = image.name.split('.').pop().toLowerCase();
        const presignedRes = await axios.get(
          `http://localhost:8000/diarys/presigned-url?file_type=${ext}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { url, key } = presignedRes.data;

        // S3로 업로드: 반드시 Content-Type 헤더 포함
        await s3client.put(url, image, {
          headers: {
            "Content-Type": image.type
          }
        });
        image_url = key;
      }

      const res = await axios.post(
        "http://localhost:8000/diarys/",
        {
          title: form.title,
          content: form.content,
          state: form.state,
          image: image_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.status === 201) {
        alert("일기 등록 완료!");
        navigate("/list");
      }
    } catch (err) {
      console.error(err);
      alert("등록 실패: " + (err.response?.data?.detail || "알 수 없는 오류"));
    }
  };

  return (
    <>
      <h2>일기 등록</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요."
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용을 입력하세요."
          rows="5"
          cols="40"
        />
        <input type="file" onChange={handleChangeFile} />
        <label>
          공개여부:
          <select name="state" value={form.state ? "public" : "private"} onChange={handleStateChange}>
            <option value="public">공개</option>
            <option value="private">비공개</option>
          </select>
        </label>
        <br />
        <button type="submit">등록</button>
      </form>
      <button onClick={() => navigate('/list')} style={{ marginTop: '20px' }}>
        목록으로
      </button>
    </>
  );
}
