import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from './apiConfig';

const apiClient = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10_000,
});

// Attach JWT token from AsyncStorage
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token'); // store token when login
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
