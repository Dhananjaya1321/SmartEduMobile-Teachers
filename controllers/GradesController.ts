import apiClient from "@/apiClient";

const gradeAPIController = {
    getAllGrades: async () => {
        try {
            const response = await apiClient.get(`/grades`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getAllGradesITeach: async () => {
        try {
            const response = await apiClient.get(`/grades/i-teach-classes/to-teacher`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default gradeAPIController;
