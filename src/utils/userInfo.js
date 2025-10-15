// userInfo.js
export function setUserId(id) {
    localStorage.setItem("user_id", id);
}


export function getUserId() {
    return localStorage.getItem("user_id");
}


export function setUserEmail(email) {
    localStorage.setItem("user_email", email);
}


export function getUserEmail() {
    return localStorage.getItem("user_email");
}


export function setUserRole(role) {
    localStorage.setItem("user_role", role);
}


export function getUserRole() {
    return localStorage.getItem("user_role");
}


export function clearUserInfo() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
}
