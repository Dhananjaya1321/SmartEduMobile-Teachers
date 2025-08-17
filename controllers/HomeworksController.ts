import apiClient from "@/apiClient";

const homeworksAPIController = {
    saveHomeworks: async (formData: any) => {
        try {
            const response = await apiClient.post(`/homeworks`, formData);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
        } catch (error) {
            console.error("Error in saveHomeworks:", error.response?.data || error.message);
            return null;
        }
    },
};

export default homeworksAPIController;
