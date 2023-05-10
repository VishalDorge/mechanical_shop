import { compare, genSalt, hash } from "bcryptjs";
import { ICredentials } from "./auth.types";
import { AuthResponses } from "./auth.responses";
import { getPrivateKey, getPublicKey } from "../../utility/key.generate";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { IUser } from "../user/user.types";
import userServices from "../user/user.services";
import { roles } from "../../utility/constant";

const encryptPassword = async (user: IUser) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(user.password, salt);
    user.password = hashedPassword;
    return user;
}

const createAdmin = (user: IUser) => {
    user.role = roles.ADMIN as string;
    return register(user);
}

const createOwner = (user: IUser) => {
    user.role = roles.OWNER as string;
    return register(user);
}

const register = async (user: IUser) => {
    user = await encryptPassword(user);
    const result = userServices.add(user);
    return result;
}

const login = async (credentials: ICredentials) => {
    const user = await userServices.findOne({ email: credentials.email });
    if (!user) throw AuthResponses.USER_NOT_FOUND;

    const isPasswordMatched = await compare(credentials.password, user.password);
    if (!isPasswordMatched) throw AuthResponses.INVALID_CREDENTIALS;

    const privateKey = getPrivateKey();
    
    const accessToken = sign({ id: user._id, role: user.role }, privateKey, { algorithm: "RS256", expiresIn: "1h" });
    
    const refreshToken = sign({ id: user._id, role: user.role, type: 1 }, privateKey, { algorithm: "RS256"});
    
    return { role: user.role, accessToken, refreshToken };
}

const generateAccessToken = (refreshToken: string) => {
    const publicKey = getPublicKey();
    const payload = verify(refreshToken, publicKey || "") as JwtPayload;
    const {type, ...userData} = payload;

    const privateKey = getPrivateKey();
    const newAccessToken = sign(userData, privateKey, {algorithm: "RS256", expiresIn: "1h"});
    return {newAccessToken};
}

export default {
    login,
    generateAccessToken,
    createAdmin,
    createOwner
}