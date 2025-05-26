// config.js
export const PORT = 3000;
export const BACKEND_URL = "http://localhost:8000/api/";
export const REQUESTS_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
};
