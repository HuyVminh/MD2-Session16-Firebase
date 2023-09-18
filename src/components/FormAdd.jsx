import React, { useEffect, useState } from 'react'
import "./form.css"
import { storage } from '../firebase/configFirebase'
import axios from 'axios';
import { notification } from 'antd';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';

export default function FormAdd({ handleCloseFormAdd, loadData }) {
    const [gender, setGender] = useState(0);
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState("");

    const [user, setUser] = useState({
        userName: "",
        gender: 0,
        dateOfBirth: "",
        image: "",
    });

    // danh sách gender
    const listGender = [
        {
            id: 0,
            title: "Nam",
        },
        {
            id: 1,
            title: "Nữ",
        },
    ];
    const imageListRef = ref(storage, "images/");

    const uploadFiles = async (file) => {
        // Phải xử lý được tác vụ thêm nhiều file => bất đồng bộ => phải sử dụng Promise

        // Tạo 1 tham chiếu <=> tạo folder trên firebase
        const imageRef = ref(storage, `/images/${file.name}`);
        uploadBytes(imageRef, file)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        return { ...user, gender: gender, image: url }
                    })
                    .then((data) => {
                        axios.post('http://localhost:3000/users', data)
                            .then((response) => {
                                if (response.status === 201) {
                                    // Hiển thị notification
                                    notification.success({
                                        message: "Thành công",
                                        description: "Thêm mới tài khoản thành công",
                                    })
                                    handleCloseFormAdd();
                                    loadData();
                                }
                            })
                            .catch(() => {
                                notification.error({
                                    message: "Cảnh báo !",
                                    description: "Lỗi hệ thống !",
                                })
                            });
                    })
            });



    }

    // useEffect(() => {
    //     listAll(imageListRef).then((response) => {
    //         response.items.forEach(item => {
    //             getDownloadURL(item).then(url => {
    //                 //Danh sách URL
    //                 setImageUrls(url);
    //             })
    //         })
    //     })
    // }, []);

    // lấy giá trị từ các ô input
    const handleChange = (e) => {
        const { value, name } = e.target;

        setUser({
            ...user,
            [name]: value,
        })
    }

    const handleSelectedFile = (e) => {
        // Lấy tất cả các giá trị trong ô input có type="file"
        const file = e.target.files[0]
        setImageUpload(file);
    }

    // Gửi dữ liệu từ form lên server
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.userName) {
            notification.error({
                message: "Cảnh báo !",
                description: "Tên tài khoản không được để trống !",
            })
            return;
        } else {
            if (!imageUpload) {
                return;
            } else {
                await uploadFiles(imageUpload);
            }
            // Gọi API register
        }
    }
    return (
        <>
            <div className='container'>
                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h3>Thêm mới tài khoản</h3>
                        <div className='btn btn-close' onClick={handleCloseFormAdd}></div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Họ và tên <span className='text-danger'>*</span></label>
                        <input type="text" className="form-control" name="userName" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Giới tính</label>
                        <div className='d-flex gap-3'>
                            {
                                listGender.map((genders) => (
                                    <div className="form-check" key={genders.id}>
                                        <input
                                            checked={genders.id === gender}
                                            onChange={() => setGender(genders.id)}
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                        />
                                        <label className="form-check-label">{genders.title}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label>
                        <input type="date" className="form-control" name="dateOfBirth" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Ảnh đại diện</label>
                        <div className='text-center mb-2'>
                            <img src={imageUpload ? URL.createObjectURL(imageUpload) : ""} alt="" width={80} style={{ borderRadius: "50%" }} />
                        </div>
                        <input type="file" className="form-control" name="image" onChange={handleSelectedFile} />
                    </div>
                    <div className='d-flex justify-content-center align-item-center gap-3'>
                        <button type="submit" className="btn btn-primary">Thêm mới</button>
                        <button type="button" className="btn btn-danger" onClick={handleCloseFormAdd}>Hủy</button>
                    </div>
                </form>
            </div>
        </>
    )
}
