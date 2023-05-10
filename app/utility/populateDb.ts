import authServices from "../featured-modules/auth/auth.services";
import roleServices from "../featured-modules/role/role.services";
import statusServices from "../featured-modules/status/status.services";
import { adminData, rolesData, statusesData } from "./constant";


export const populate = async () => {
    try {
        await authServices.createAdmin(adminData);
        statusesData.forEach(async status => await statusServices.add(status));
        rolesData.forEach(async role => await roleServices.add(role));
    } catch (error) {
        console.log("Data is Already Populated...");
    }
}