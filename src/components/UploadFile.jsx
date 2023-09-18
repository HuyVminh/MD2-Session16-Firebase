import React, { useEffect, useState } from 'react'
import { storage } from '../firebase/configFirebase'
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import ReactPlayer from 'react-player'

export default function UploadFile() {

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  console.log(imageUrls);

  // Tạo 1 tham chiếu đến thư mục chứa kho ảnh trên firebase
  const imageListRef = ref(storage, "images/");

  // Hàm upload được file lên firebase
  const uploadFiles = (files) => {
    // Phải xử lý được tác vụ thêm nhiều file => bất đồng bộ => phải sử dụng Promise
    Promise.all(
      files.map(file => {
        // Tạo 1 tham chiếu <=> tạo folder trên firebase
        const imageRef = ref(storage, `/images/${file.name}`);
        return uploadBytes(imageRef, file).then(snapshot => {
          return getDownloadURL(snapshot.ref)
        });
      })
    ).then(urls => {
      // Trả về danh sách các urls
      setImageUrls((prev) => [...prev, urls]);
    })
  }
  console.log(imageUpload);

  const handleSelectedFiles = (e) => {
    // Lấy tất cả các giá trị trong ô input có type="file"
    const files = Array.from(e.target.files);
    setImageUpload(files)
  }

  // Khi click vào nut upload thì tiến hành upload lên firebase
  const handleUpload = () => {
    if (!imageUpload) {
      return;
    } else {
      uploadFiles(imageUpload);
    }
  }

  // Lấy url trên firebase
  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach(item => {
        getDownloadURL(item).then(url => {
          //Danh sách URL
          setImageUrls(prev => [...prev, url]);
        })
      })
    })
  }, []);

  return (
    <div>
      <h1>Danh sách hình ảnh</h1>
      <div style={{ display: "flex", gap: 10 }}>
        {
          imageUrls.map(url => (
            <ReactPlayer url={url} controls={true} />
            // <img src={url} alt="ảnh" key={url} style={{ objectFit: "cover" }} height={150} width={150} />
          ))
        }
      </div>
      <input type="file" name="" onChange={handleSelectedFiles} multiple />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}
