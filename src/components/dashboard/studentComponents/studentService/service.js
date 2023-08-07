import axios from "axios";
import { STUDENTS_API_BASE_URL } from "../../../../actions/types";
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


export const add_student_semester_courses = async (courseName, courseCode, creditHours, lecturerID) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    const body = JSON.stringify({ courseName, courseCode, creditHours, lecturerID });
    await axios.post(STUDENTS_API_BASE_URL + `addSemesterCourses/`, body, config)
        .then(res => res.data)
        .catch(err => console.log(err))
}


export const update_sudent_courses = async (id, courseName, courseCode, creditHours, lecturerID) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    const body = JSON.stringify({ courseName, courseCode, creditHours, lecturerID });
    await axios.put(STUDENTS_API_BASE_URL + `updateSemesterCourses/${id}/`, body, config)
        .then(res => res.data)
        .catch(err => console.log(err))
}

export const delete_student_course = async (id) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`,
            "accept": "application/json"
        }
    };
    await axios.delete(STUDENTS_API_BASE_URL + `deleteCourse/${id}`, config)
        .then(res => res.code)
        .catch(err => console.log(err))
}