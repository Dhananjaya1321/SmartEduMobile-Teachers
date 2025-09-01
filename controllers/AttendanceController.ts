import apiClient from "@/apiClient";

const attendanceAPIController = {
    saveAttendance: async (payload: any) => {
        try {
            const response = await apiClient.post(`/attendance`, payload);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
        } catch (error) {
            return null;
        }
    },
    getAllAttendanceByClassId: async (classId:any) => {
        try {
            const response = await apiClient.get(`/attendance/class/today/${classId}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getAllStudentsAllAttendanceByClassId: async (classId:any) => {
        try {
            const response = await apiClient.get(`/attendance/class/year/${classId}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    getAllAttendanceByStudentId: async (studentId:any) => {
        try {
            const response = await apiClient.get(`/attendance/class/by-student-id/${studentId}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default attendanceAPIController;
