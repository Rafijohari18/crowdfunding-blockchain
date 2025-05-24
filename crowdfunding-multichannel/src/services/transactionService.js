import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

export const fetchTransactions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/transactions/get-all`);
        return response.data ?? [];
    } catch (error) {
        console.error("fetchTransactions error:", error);
        throw error;
    }
};
