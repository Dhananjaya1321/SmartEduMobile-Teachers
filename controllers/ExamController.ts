import apiClient from "@/apiClient";

const examAPIController = {
    releaseMarks: async (payload: any) => {
        try {
            const response = await apiClient.post(`/results`, payload);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
        } catch (error) {
            return null;
        }
    },
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
    getAllTermExamsMyClass: async (gradeId:any,year:any) => {
        try {
            const response = await apiClient.get(`/exams/grade/term-exams/my-class/to-teachers/${gradeId}/${year}`);
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
    checkExamResults: async (gradeId:any,year:any) => {
        try {
            const response = await apiClient.get(`/exams/check-term-tests/to-teachers/${gradeId}/${year}`);
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
