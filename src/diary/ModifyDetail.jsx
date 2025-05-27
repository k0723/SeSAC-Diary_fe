import {useEffect, useState} from "react";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";
import "../css/modify.css";

const ModifyDetail = () => {
    const { diary_id } = useParams(); // useParams()를 사용하여 diaryId를 가져옵니다.
    const [diary, setDiary] = useState({ title: "", content: "", image: "" });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // token을 sessionStorage에서 가져옵니다.
    const token = window.sessionStorage.getItem("access_token");

    useEffect(() => {
        const fetchDiaryData = async () => {
            try {
                // diaryId와 token을 사용하여 일기 데이터를 가져옵니다.
                const response = await axios.get(`http://localhost:8000/diarys/${diary_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDiary({
                    title: response.data?.title || "",   // undefined일 경우 빈 문자열로 처리
                    content: response.data?.content || "", // undefined일 경우 빈 문자열로 처리
                    image: response.data?.image || ""      // undefined일 경우 빈 문자열로 처리
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('해당 일기를 찾을 수 없습니다.');
                    setTimeout(() => navigate('/list'), 3000);
                } else {
                    console.error("일기 데이터 불러오기 실패", error);
                    setError("일기 데이터를 불러오는 데 실패했습니다.");
                }

            }
        };

        if (token) {
            fetchDiaryData();
        } else {
            alert("토큰값이 없습니다.");
            navigate('/list')
        }
    }, [diary_id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiary({ ...diary, [name]: value });
    };

    const handleChangeFile = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSave = async () => {
        if (!token) {
            alert("유효하지 않은 토큰입니다.");
            return;
        }

        setLoading(true);
        try {
            let image_url = diary.image; // 기존 이미지 URL을 사용

            if (image) {
                const ext = image.name.split('.').pop().toLowerCase();
                const presignedRes = await axios.get(`http://localhost:8000/diarys/presigned-url?file_type=${ext}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { url, key } = presignedRes.data;

                await axios.put(url, image); // S3로 업로드
                image_url = key; // 업로드 후 이미지 URL로 업데이트
            }

            const updatedDiary = {
                ...diary,
                image: image_url, // 이미지 URL 업데이트
            };

            // 일기 데이터를 PUT 요청으로 서버에 저장
            await axios.put(`http://localhost:8000/diarys/${diary_id}`, updatedDiary, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("일기가 성공적으로 수정되었습니다.");
            navigate("/list"); // 수정 완료 후 목록으로 이동
        } catch (error) {
            console.error("일기 수정 실패", error);
            alert("일기 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 에러 처리 및 로딩 상태 표시
    if (error) return <p>{error}</p>;
    if (loading) return <p>수정 중...</p>;




    return (
        <>
            <div>
                <h1>일기 수정</h1>
                <div className="modify-form">
                    <input type="text" name="title" value={diary.title} placeholder="수정할 제목을 입력하세요." onChange={handleChange} />
                    <input type="text" name="content" value={diary.content} placeholder="수정할 내용을 입력하세요." onChange={handleChange} />
                    <input type="file" onChange={handleChangeFile} />
                </div>
                <button onClick={handleSave} disabled={loading}>
                    {loading ? '수정 중...' : '수정'}
                </button>
            </div>

        </>
    )



}
export default ModifyDetail;