import apiClient from "@/apiClient";

const classTimetablesAPIController = {
    findMyClassesTimetableToTeacher: async () => {
        try {
            const response = await apiClient.get(`/timetables/my-classes/to-teacher`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    findOtherClassesTimetableToTeacherByClassId: async (classId:any) => {
        try {
            const response = await apiClient.get(`/timetables/other-classes/to-teacher/${classId}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default classTimetablesAPIController;
