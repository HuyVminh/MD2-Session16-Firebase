import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { notification } from 'antd';
import FormAdd from '../components/FormAdd';
import { formatDate } from '../utils/formatData';

export default function ListUser() {

    const [users, setUsers] = useState([]);
    const [showFormAdd, setShowFormAdd] = useState(false);
    const [search, setSearch] = useState("");

    // Gọi API lấy thông tin tất cả user
    const loadData = () => {
        axios.get(`http://localhost:3000/users?userName_like=${search}`)
            .then((response) => setUsers(response.data))
            .catch((error) => console.log(error));
    }
    useEffect(() => {
        loadData();
    }, []);

    // Hàm xóa user
    const handleDelete = (id) => {
        // Gọi API
        axios.delete(`http://localhost:3000/users/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    notification.success({
                        message: "Thành công",
                        description: "Xóa tài khoản thành công"
                    });
                    loadData();
                }
            })
            .catch((error) => console.log(error));
    }

    // Hiển thị form thêm mới
    const handleShowFormAdd = () => {
        setShowFormAdd(true);
    }

    // Hàm đóng form
    const handleCloseFormAdd = () => {
        setShowFormAdd(false);
    }
    return (
        <>
            {showFormAdd && <FormAdd handleCloseFormAdd={handleCloseFormAdd} loadData={loadData} />}
            <div className='m-5'>
                <div className='d-flex justify-content-between'>
                    <button className='btn btn-primary mb-3' onClick={handleShowFormAdd}>Thêm mới tài khoản</button>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} name="" className='form-control' style={{ width: 300, height: 36 }} placeholder='Nhập từ khóa tìm kiếm' />
                </div>
                <table className='table table-bordered table-hover table-striped'>
                    <thead>
                        <tr className='text-center'>
                            <th scope='col'>STT</th>
                            <th scope='col' className='w-32'>Ảnh Đại diện</th>
                            <th scope='col'>Họ và tên</th>
                            <th scope='col'>Giới tính</th>
                            <th scope='col'>Ngày sinh</th>
                            <th scope='col' colSpan={2}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => (
                                <tr key={user.id} className='text-center'>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={user.image} alt="ảnh" key={user.image} className='img-fluid img-thumbnail' width={100} />
                                    </td>
                                    <td>{user.userName}</td>
                                    <td>{user.gender === 0 ? "Nam" : "Nữ"}</td>
                                    <td>{formatDate(user.dateOfBirth)}</td>
                                    <td>
                                        <button className='btn btn-warning w-4/5'>Sửa</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-danger w-4/5' onClick={() => handleDelete(user.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}
