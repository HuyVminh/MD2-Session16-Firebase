import { Input, Radio, message } from 'antd'
import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/configFirebase';

export default function SignUp() {
    const [gender, setGender] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const [user, setUser] = useState({
        userName: "",
        gender: 0,
        dateOfBirth: "",
        image: "",
    })

    const handleChange = (e) => {
        const { value, name } = e.target;

        setUser({
            ...user,
            [name]: value,
        })
    }

    // Tạo 1 tham chiếu đến kho ảnh trên firebase
    const imageListRef = ref(storage, "images/");

    const handleCheck = (e) => {
        console.log('radio checked', e.target.value);
        setGender(e.target.value);
    }

    const props = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // Lấy đường dẫn của ảnh sau khi hoàn tất upload
                const downloadURL = info.file.response.url;
                // Lưu đường dẫn vào trong 1 state
                setImageUrl(downloadURL);
                // Hiển thị thông báo
                message.success(`Tải lên hình ảnh thành công !`);
            } else if (info.file.status === 'error') {
                message.error(`Tải lên thất bại !`);
            }
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                // Tạo 1 tham chiếu đến kho ảnh trên firebase
                const imageRef = ref(imageListRef, file.name);
                // Tải ảnh lên firebase
                await uploadBytes(imageRef, file);
                // Lấy Url từ firebase về
                const downloadUrl = await getDownloadURL(imageRef);
                setUser({ ...user, image: downloadUrl });
                // Gọi hàm OnSuccess để thông báo là upload ảnh thành công
                onSuccess({ url: downloadUrl });

            } catch (error) {
                onError(error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(user);
    }

    return (
        <>
            <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-rgba-black'>
                <form className='bg-white p-6 rounded-md w-1/3' onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center py-1.5 mb-3'>
                        <h1 className='text-xl font-bold'>Sign Up</h1>
                        <button className='btn btn-close'></button>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="userName" className='form-label'>Họ và tên</label>
                        <Input placeholder="Nhập họ và tên" name='userName' onChange={handleChange} />
                    </div >
                    <div className='mb-3'>
                        <label htmlFor="dateOfBirth" className='form-label'>Ngày sinh</label>
                        <Input type='date' placeholder="Nhập họ và tên" name='dateOfBirth' onChange={handleChange} />
                    </div>
                    <div className='flex items-center justify-start gap-10'>
                        <label htmlFor="gender" className='form-label'>Giới tính :</label>
                        <Radio.Group onChange={handleCheck} value={gender}>
                            <Radio value={0}>Nam</Radio>
                            <Radio value={1}>Nữ</Radio>
                            <Radio value={2}>Khác</Radio>
                        </Radio.Group>
                    </div>
                    <div className='mb-3'>
                        <label className='form-label mr-3'>Ảnh đại diện :</label>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email" className='form-label'>Email</label>
                        <Input placeholder="Nhập họ và tên" name='email' onChange={handleChange} />
                    </div >
                    <div className='mb-4'>
                        <label htmlFor="password" className='form-label'>Mật Khẩu</label>
                        <Input type='password' placeholder="Nhập họ và tên" name='password' onChange={handleChange} />
                    </div>
                    <div className='mb-3'>
                        <Button htmlType='submit' type='primary' className='w-full btn-primary text-black'>Sign Up</Button>
                    </div>
                </form>
            </div>
        </>
    )
}
