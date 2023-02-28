import crypto from "crypto";

const hashSha256 = (stringToHash: string): string => {
  return crypto.createHash("sha256").update(stringToHash).digest("hex");
};

export default hashSha256;
