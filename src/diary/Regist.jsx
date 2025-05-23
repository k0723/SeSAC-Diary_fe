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
        content: '',
        private: '',
    });

    // const { id, title, image, description, tags, location } = form;
    const { id, title, content, state } = form;

    const [image, setImage] = useState(null);
    const handleChangeFile = e => {
        setImage(e.target.files[0]);
    };


    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
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
            .post("http://localhost:8000/diarys/",
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
            <h2>일기 등록</h2>
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} value={id} type="number" name="id" placeholder="일기 번호를 입력하세요." />
                <input onChange={handleChange} value={title} type="text" name="title" placeholder="제목을 입력하세요." />
                <input onChange={handleChange} value={content} type="text" name="content" placeholder="내용을 입력하세요." />
                <input onChange={handleChangeFile} type="file" name="image" />
                {/* <input onChange={handleChange} value={state} type="checkbox" name="state" placeholder="공개 하시려면 체크하세요." /> */}
                <input
                    type="checkbox"
                    name="state"
                    checked={form.state === "공개"}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            state: e.target.checked ? "공개" : "비공개"
                        })
                    }
                />
                <label htmlFor="state">공개하시려면 체크하세요.</label>
                <button type="submit">등록</button>
            </form>
        </>
    );
}