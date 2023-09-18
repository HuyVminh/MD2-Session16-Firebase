/**
 * Hàm format tiền tệ Việt Nam
 * @param {*} money Chuỗi tiền tệ cần format
 * @returns Chuỗi tiền tệ đã được format
 * Author:VMHuy(11/09/2023)
 */

export const formatMoney = (money) => {
    return money.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    })
};

/**
 * Định dạng chuỗi thời gian
 * @param {*} date  Chuỗi thời gian cần định dạng
 * @returns : Định dạng thời gian theo dạng ngày-tháng-năm
 * Author: VMHuy (12/09/2023)
 */
export const formatDate = (date) => {
    // Lấy ra định dạng thời gian của chuỗi dựa vào thời gian thực
    const today = new Date(date);
    // lấy ra năm
    let year = today.getFullYear();
    // lấy ra tháng
    let month = today.getMonth() + 1;
    if (month > 0 && month < 10) {
        month = `0${month}`
    }
    let day = today.getDate();
    if (day > 0 && day < 10) {
        day = `0${day}`
    }
    // trả ra chuỗi cần định dạng
    return `${day}-${month}-${year}`
};

/**
 * Validate email
 * @param {*} email : chuỗi email cần kiểm tra
 * @returns true nếu đúng định dạng, false nếu sai định dạng
 * Author: NVQUY(12/09/2023)
 */
export const formatEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
