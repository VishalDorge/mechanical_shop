import fs from "fs";
import path from 'path'

export const getPublicKey = () => fs.readFileSync(path.resolve(__dirname, "keys","public.pem"), { encoding: "utf8" });
export const getPrivateKey = () => fs.readFileSync(path.resolve(__dirname, "keys","private.pem"), { encoding: "utf8" });