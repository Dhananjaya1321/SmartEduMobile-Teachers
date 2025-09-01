import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from './apiConfig';
import {router} from "expo-router";


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
        const token = await AsyncStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired/invalid token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            // Navigate back to login screen
            router.replace('/LoginScreen');
        }
        return Promise.reject(error);
    }
);
export default apiClient;
