import apiClient from "@/apiClient";

const examAPIController = {
    getAllTermExams: async () => {
        try {
            const response = await apiClient.get(`/exams/grade/term-exams/to-teachers`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getALExams: async () => {
        try {
            const response = await apiClient.get(`/exams/grade/al-exams/to-parents`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getOLExams: async () => {
        try {
            const response = await apiClient.get(`/exams/grade/ol-exams/to-parents`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getG5Exams: async () => {
        try {
            const response = await apiClient.get(`/exams/grade/g5-exams/to-parents`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default examAPIController;
