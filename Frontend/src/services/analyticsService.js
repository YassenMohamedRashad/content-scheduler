import axios from "axios";
import { BACKEND_URL, REQUESTS_HEADERS } from "../config";
import { getUserToken } from "../contexts/authContext";


export const getAllActivities = async ( page = 1, search = '', type = 'all' ) =>
{
    const params = new URLSearchParams( {
        page: page.toString(),
    } );
    if ( search ) params.append( 'search', search );
    if ( type && type !== 'all' ) params.append( 'type', type );

    const response = await axios.get(
        `${ BACKEND_URL }analytics/activity-log?${ params.toString() }`,
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};

export const getDashboardAnalytics = async () =>
{

    const response = await axios.get(
        `${ BACKEND_URL }analytics/`,
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};
