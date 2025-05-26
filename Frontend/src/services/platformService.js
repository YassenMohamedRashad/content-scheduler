import axios from "axios";
import { BACKEND_URL, REQUESTS_HEADERS } from "../config";
import { getUserToken } from "../contexts/authContext";


export const getAllPlatforms= async () =>
{
    const response = await axios.get(
        `${ BACKEND_URL }platforms`,
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};
    
export const changePlatformStatus = async ( platformId, status ) =>
{
    const response = await axios.put(
        `${ BACKEND_URL }platforms/${ platformId }/change-account-status`,
        { status },
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
};

export const syncPlatform = async (platformId , username) =>
{
    const response = await axios.post(
        `${ BACKEND_URL }platforms/sync`,
        { username , platform_id : platformId},
        {
            headers: {
                ...REQUESTS_HEADERS,
                Authorization: `Bearer ${ getUserToken() }`
            }
        }
    );
    return response.data;
}