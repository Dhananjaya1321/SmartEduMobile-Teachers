import apiClient from "@/apiClient";

const studentResultsAPIController = {
    getAllClassStudentsResultsDetails: async (examId:any) => {
        try {
            const response = await apiClient.get(`/results/my-class/to-teachers/${examId}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getStudentsResultsDetails: async (studentId:any) => {
        try {
            const response = await apiClient.get(`/results/my-class/student/to-teachers/${studentId}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default studentResultsAPIController;
