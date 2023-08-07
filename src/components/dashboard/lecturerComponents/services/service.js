import axios from "axios";
import { LECTURERS_API_BASE_URL } from "../../../../actions/types";
import { USERS_API_BASE_URL } from "../../../../actions/types";

export const checkCurrentStatus = async () => {
    if (localStorage.getItem("access")) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        };
        await axios.get(USERS_API_BASE_URL + `getUser/`, config)
            .then(res => localStorage.setItem("details", res.data))
            .catch(err => console.log(err))
    }
};


export const add_lecturer_semester_courses = async (level, className, courseCode, courseName, creditHours) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    const body = JSON.stringify({ level, className, courseCode, courseName, creditHours });
    await axios.post(LECTURERS_API_BASE_URL + `lecturerAddSemesterCourse/`, body, config)
        .then(res => res.data)
        .catch(err => console.log(err))
}


export const update_lecture_courses = async (id, level, className, courseCode, courseName, creditHours) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    const body = JSON.stringify({ level, className, courseCode, courseName, creditHours });
    await axios.put(LECTURERS_API_BASE_URL + `lecturerUpdateSemesterCourse/${id}/`, body, config)
        .then(res => res.data)
        .catch(err => console.log(err))
}

export const delete_lecturer_course = async (id) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    await axios.delete(LECTURERS_API_BASE_URL + `lecturerDeleteSemesterCourse/${id}`, config)
        .then(res => res.code)
        .catch(err => console.log(err))
}


export const invigilator_add_courses = async (courseCode, courseName) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    const body = JSON.stringify({ courseCode, courseName });
    await axios.post(LECTURERS_API_BASE_URL + `invigilatorAddCourse/`, body, config)
        .then(res => res.data)
        .catch(err => console.log(err))
}