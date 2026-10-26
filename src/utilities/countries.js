import axios from "axios";


export const getCountryCodeByIp = async (ipAddress) => {
    try {
        const { data } = await axios.get(
            `https://ipapi.co/${ipAddress}/json/`
        );

        return data.country_code;
    } catch (error) {
        console.log("Country lookup failed:", error.response?.status);
        return null;
    }
};