import axios from "axios";
import { BACKEND_URL, REQUESTS_HEADERS } from "../config";
import { getUserToken } from "../contexts/authContext";


export const login = async ( data ) =>
{
    const response = await axios.post(
        BACKEND_URL + "auth/login",
        {
            email: data.email,
            password: data.password
        },
        {
            headers: {
                ...REQUESTS_HEADERS
            }
        }
    );
    return response.data;
};

export const registerUser = async ( data ) =>
{
    const response = await axios.post(
        BACKEND_URL + "auth/register",
        {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.confirmPassword
        },
        {
            headers: {
                ...REQUESTS_HEADERS
            }
        }
    );
    return response.data;
};


export const updateProfile = async ( data ) =>
{
    const payload = {
        ...( data.name && { name: data.name } ),
        ...( data.email && { email: data.email } ),
        ...( data.currentPassword && { current_password: data.currentPassword } ),
        ...( data.newPassword && { new_password: data.newPassword } ),
        ...( data.confirmPassword && { new_password_confirmation: data.confirmPassword } ),
    };

    const response = await axios.put(
        BACKEND_URL + 'auth/update-profile',
        payload,
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            },
        }
    );
    return response.data;
};


export const logout = async () =>
{
    const response = await axios.post(
        BACKEND_URL + "auth/logout",
        {},
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};


export const getUser = async () =>
{
    const response = await axios.get(
        BACKEND_URL + "auth/me",
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
}

