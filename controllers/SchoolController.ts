import apiClient from "@/apiClient";

const schoolAPIController = {
    getAllSchoolsByProvinceAndDistrictAndZonal: async (province:any,district:any,zonal:string) => {
        try {
            const response = await apiClient.get(`/schools/to-teacher/${province}/${district}/${zonal}`);
            if (response.status === 200 && response.data.state === "OK") {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
};

export default schoolAPIController;
