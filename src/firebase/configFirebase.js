
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCe2PubP-7FPv497eFkVWr6ujTWLDq0a4s",
    authDomain: "project-module-02.firebaseapp.com",
    projectId: "project-module-02",
    storageBucket: "project-module-02.appspot.com",
    messagingSenderId: "394241380002",
    appId: "1:394241380002:web:0db7b02929d23d349291fb"
};

// Khởi tạo firebase
const app = initializeApp(firebaseConfig);
// Tạo tham chiếu đến dịch vụ lưu trữ
// được sử dụng để tham chiếu trong toàn bộ ứng dụng
const storage = getStorage(app);

// export ra bên ngoài để sử dụng
export { storage };