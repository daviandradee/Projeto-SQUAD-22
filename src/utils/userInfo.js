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


export function setDoctorId(doctorId) {
    localStorage.setItem("doctor_id", doctorId);
}


export function getDoctorId() {
    return localStorage.getItem("doctor_id");
}


export function setPatientId(patientId) {
    localStorage.setItem("patient_id", patientId);
}


export function getPatientId() {
    return localStorage.getItem("patient_id");
}


export function setFullName(fullName) {
    localStorage.setItem("full_name", fullName);
}


export function getFullName() {
    return localStorage.getItem("full_name");
}


export function clearUserInfo() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("doctor_id");
    localStorage.removeItem("patient_id");
    localStorage.removeItem("full_name");
}