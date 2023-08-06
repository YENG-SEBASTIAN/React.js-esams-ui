import axios from "axios";
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATION_SUCCESS,
    AUTHENTICATION_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    LOGOUT,
    REACT_API_BASE_URL,
    USERS_API_BASE_URL,
    STUDENTS_API_BASE_URL,
    LECTURERS_API_BASE_URL
} from './types';


export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem("access")) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        };
        const body = JSON.stringify({ token: localStorage.getItem("access") });

        try {
            const res = await axios.post(REACT_API_BASE_URL + `auth/jwt/verify/`, body, config)
            if (res.data.code !== "token_not_valid") {
                dispatch({
                    type: AUTHENTICATION_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATION_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: AUTHENTICATION_FAIL
            });
        }
    } else {
        dispatch({
            type: ACTIVATION_FAIL
        });
    }
};


export const load_user = () => async dispatch => {
    if (localStorage.getItem("access")) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${localStorage.getItem("access")}`,
                "accept": "application/json"
            }
        };

        try {
            const res = await axios.get(REACT_API_BASE_URL + `auth/users/me`, config);
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};


export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post(REACT_API_BASE_URL + `auth/jwt/create/`, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
};


export const signup = (username, fullName, email, level, role, password, re_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    const body = JSON.stringify({ username, fullName, email, level, role, password, re_password });
    try {
        const res = await axios.post(REACT_API_BASE_URL + `auth/users/`, body, config);
        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        });
    }
};


export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    const body = JSON.stringify({ uid, token });
    try {
        await axios.post(REACT_API_BASE_URL + `auth/users/activation/`, body, config);
        dispatch({
            type: ACTIVATION_SUCCESS,
        });
        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        })
    }
};


export const password_reset = (email) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    const body = JSON.stringify({ email });
    try {
        await axios.post(REACT_API_BASE_URL + `auth/users/reset_password/`, body, config);
        dispatch({
            type: PASSWORD_RESET_SUCCESS,
        });
        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        })
    }
};


export const password_reset_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    const body = JSON.stringify({ uid, token, new_password, re_new_password });
    try {
        await axios.post(REACT_API_BASE_URL + `auth/users/reset_password_confirm/`, body, config);
        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
        });
        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        })
    }
};


export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
}