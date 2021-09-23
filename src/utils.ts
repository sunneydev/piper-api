import crypto from "crypto";

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const encrypt = (str: string) =>
  crypto.createHash("sha1").update(str).digest("hex");
