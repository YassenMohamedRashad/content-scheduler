export const getUserToken = () =>
{
    const token = localStorage.getItem("token");
    if (token) {
        return token;
    }
    return null;
};

export const setUserToken = (token) =>
{
    localStorage.setItem("token", token);
};

export const setUserData = (userData) =>
{
    localStorage.setItem("user_data", JSON.stringify(userData));
};

export const checkUserAuth = () =>
{
    const token = getUserToken();
    if (token) {
        return true;
    }
    return false;
};

export const clearUserData = () =>
{
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
}