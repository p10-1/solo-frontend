import axios from 'axios';

const API_BASE_URL = '/api/mypage';

export const getAsset = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAsset`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('자산 불러오기 실패:', error);
        throw error; // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
    }
};

export const updateAsset = async (data) => {
    try {
        await axios.post(`${API_BASE_URL}/updateAsset`, data, { withCredentials: true });
        return true;
    } catch (error) {
        console.error('업데이트 실패:', error);
        throw error; // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
    }
};
