import apiClient from "@/apiClient";

const eventAPIController = {
    getAllEventsToTeacher: async () => {
        try {
            const response = await apiClient.get(`/events/to-teacher`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default eventAPIController;
