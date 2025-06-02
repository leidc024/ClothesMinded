// testJwt.ts
const { HmacSHA256, enc } = require("crypto-js");
const { encode: btoa } = require("base-64");

const generateToken = (ak: string, sk: string) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: ak,
    exp: now + 1800,
    nbf: now - 5,
    iat: now,
  };

  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const signature = HmacSHA256(`${encodedHeader}.${encodedPayload}`, sk)
    .toString(enc.Base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Test with your actual keys
const AK = "your_access_key_here";
const SK = "your_secret_key_here";

console.log("Generated JWT:", generateToken(AK, SK));
