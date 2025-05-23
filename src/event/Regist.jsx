import "../App.css";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Regist() {
    const navigator = useNavigate();
    
    const [form, setForm] = useState({
        id: '', 
        title: '', 
        // image: '', 
        description: '', 
        tags: '', 
        location: ''
    });

    // const { id, title, image, description, tags, location } = form;
    const { id, title, description, tags, location } = form;

    const [image, setImage] = useState(null);
    const handleChangeFile = e => {
        setImage(e.target.files[0]);
    };


    const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("data", JSON.stringify(form));
        formData.append("image", image);

        const token = window.sessionStorage.getItem("access_token");
        axios
            /*
            .post("http://localhost:8000/events/", 
                { id, title, image, description, tags, location }, 
                { headers: { Authorization: `Bearer ${token}` } })
            */
            .post("http://localhost:8000/events/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                })
            .then(res => {
                console.log(res);
                if (res.status === 201) {
                    alert(res.data.message);
                    navigator("/list");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <h2>이벤트 등록</h2>
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} value={id} type="number" name="id" placeholder="이벤트 ID를 입력하세요." />
                <input onChange={handleChange} value={title} type="text" name="title" placeholder="이벤트 제목을 입력하세요." />
                <input onChange={handleChangeFile} type="file" name="image" />
                <input onChange={handleChange} value={description} type="text" name="description" placeholder="이벤트 설명을 입력하세요." />
                <input onChange={handleChange} value={tags} type="text" name="tags" placeholder="이벤트 관련 태그를 입력하세요." />
                <input onChange={handleChange} value={location} type="text" name="location" placeholder="이벤트 위치를 입력하세요." />
                <button type="submit">등록</button>
            </form>
        </>
    );
}