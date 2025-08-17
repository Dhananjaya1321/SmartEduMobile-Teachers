import apiClient from "@/apiClient";

const studentAPIController = {
    saveStudent: async (student: any) => {
        try {
            const response = await apiClient.post(`/students`, student);
            if (response.status === 200) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },
    getRegistrationNumber: async () => {
        try {
            const response = await apiClient.get(`/students/registration-number`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    findStudentToTeacher: async () => {
        try {
            const response = await apiClient.get(`/students/to-parents`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default studentAPIController;
