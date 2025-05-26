import axios from "axios";
import { BACKEND_URL, REQUESTS_HEADERS } from "../config";
import { getUserToken } from "../contexts/authContext";

export const getAllPosts = async ( params ) =>
{
    const response = await axios.get(
        `${ BACKEND_URL }posts?${ params.toString() }`,
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};


// export const getAllPosts = async ( page = 1, search = '', status = '' ) =>
// {
//     const params = new URLSearchParams( {
//         page: page.toString(),
//     } );
//     if ( search ) params.append( 'search', search );
//     if ( status && status !== 'all' ) params.append( 'status', status );

//     const response = await axios.get(
//         `${ BACKEND_URL }posts?${ params.toString() }`,
//         {
//             headers: {
//                 ...REQUESTS_HEADERS,
//                 Authorization: `Bearer ${ getUserToken() }`
//             }
//         }
//     );
//     return response.data;
//     };



export const getSinglePost = async ( post_id ) =>
{
    const response = await axios.get(
        `${ BACKEND_URL }posts/${ post_id }`,
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};

export const createPost = async ( formData ) =>
{
    const response = await axios.post( `${ BACKEND_URL }posts`, formData, {
        headers: {
            ...REQUESTS_HEADERS,
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${ getUserToken() }`
        },
    } );
    return response.data;
};

export const updatePost = async ( postId, formData ) =>
{
    const response = await axios.post( `${ BACKEND_URL }posts/${ postId }?_method=PUT`, formData, {
        headers: {
            ...REQUESTS_HEADERS,
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${ getUserToken() }`
        },
    } );
    return response.data;
};

export const deletePost = async ( postId ) =>
{
    const response = await axios.delete( `${ BACKEND_URL }posts/${ postId }`, {
        headers: {
            ...REQUESTS_HEADERS,
            Authorization: `Bearer ${ getUserToken() }`
        },
    } );
    return response.data;
};
