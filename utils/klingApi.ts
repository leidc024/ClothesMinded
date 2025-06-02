// // import jwt from "react-native-pure-jwt";
// // import { jwt } from "react-native-pure-jwt";
// // import { HmacSHA256, enc } from "crypto-js";
// // import { encode as btoa } from "base-64";
// // // import jwt from "jsonwebtoken";

// const API_BASE_URL = "https://api-singapore.klingai.com";

// // const jwt = require("react-native-pure-jwt");

// interface KlingConfig {
//   KLING_API_KEY_ID: string;
//   KLING_API_SECRET: string;
// }

// export const generateVirtualTryOn = async (
//   humanImage: string,
//   clothImage: string,
//   config: KlingConfig
// ): Promise<string> => {
//   try {
//     const token = generateJwtToken(
//       config.KLING_API_KEY_ID,
//       config.KLING_API_SECRET
//     );

//     console.log("Generated Token:", token);

//     // Create the try-on task
//     const response = await fetch(
//       `${API_BASE_URL}/v1/images/kolors-virtual-try-on`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json", // <-- fixed typo here
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           model_name: "kolors-virtual-try-on-v1-5",
//           human_image: humanImage,
//           cloth_image: clothImage,
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       console.log(response);
//       console.log("check error at top if this message is sent response");
//       throw new Error(data.message || `API Error: ${response.status}`);
//     }

//     if (!data.data?.task_id) {
//       console.log("new error if it reaches here");
//       throw new Error("Invalid response format - missing task_id");
//     }

//     // Poll for task completion
//     const taskId = data.data.task_id;
//     let attempts = 0;
//     const maxAttempts = 30;
//     const delayMs = 2000;

//     while (attempts < maxAttempts) {
//       await new Promise((resolve) => setTimeout(resolve, delayMs));

//       const result = await checkTaskStatus(taskId, token);
//       console.log(`Polling attempt ${attempts + 1}:`, result);

//       if (result.task_status === "succeed") {
//         if (result.task_result?.images?.[0]?.url) {
//           return result.task_result.images[0].url;
//         }
//         throw new Error("Missing image URL in successful response");
//       } else if (result.task_status === "failed") {
//         throw new Error(result.task_status_msg || "Try-on failed");
//       }

//       attempts++;
//     }

//     throw new Error("Try-on timed out");
//   } catch (error) {
//     console.error("Virtual Try-On Error:", error);
//     throw error instanceof Error ? error : new Error("Unknown error occurred");
//   }
// };

// const checkTaskStatus = async (taskId: string, token: string) => {
//   const response = await fetch(
//     `${API_BASE_URL}/v1/images/kolors-virtual-try-on/${taskId}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || `Status check failed: ${response.status}`);
//   }

//   if (!data.data) {
//     throw new Error("Invalid task status response format");
//   }

//   return data.data;
// };

// // const generateJwtToken = (ak: string, sk: string): string => {
// //   const now = Math.floor(Date.now() / 1000);

// //   // 1. Prepare token components
// //   const header = { alg: "HS256", typ: "JWT" };
// //   const payload = {
// //     iss: ak.trim(),
// //     exp: now + 3600, // 1 hour expiration
// //     nbf: now - 600, // Valid since 10 minutes ago
// //     iat: now,
// //   };

// //   // 2. Create proper encoding function
// //   const encodeBase64Url = (data: object): string => {
// //     // First convert object to JSON string
// //     const jsonString = JSON.stringify(data);
// //     // Then encode to Base64
// //     const base64 = btoa(jsonString);
// //     // Convert to Base64Url
// //     return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
// //   };

// //   // 3. Encode components
// //   const encodedHeader = encodeBase64Url(header);
// //   const encodedPayload = encodeBase64Url(payload);

// //   // 4. Create signature
// //   const signatureInput = `${encodedHeader}.${encodedPayload}`;
// //   const signature = HmacSHA256(signatureInput, enc.Utf8.parse(sk.trim()))
// //     .toString(enc.Base64)
// //     .replace(/\+/g, "-")
// //     .replace(/\//g, "_")
// //     .replace(/=+$/, "");

// //   // 5. Construct final token
// //   const token = `${encodedHeader}.${encodedPayload}.${signature}`;

// //   console.log("JWT Token Generated:", {
// //     header,
// //     payload,
// //     signatureInput,
// //     finalToken: token,
// //   });

// //   return token;
// // };

// const generateJwtToken = (ak: string, sk: string): string => {
//   const now = Math.floor(Date.now() / 1000);

//   return jwt.sign(
//     {
//       iss: ak.trim(),
//       exp: now + 1800, // 30 minutes
//       nbf: now - 5, // 5 seconds ago
//       iat: now,
//     },
//     sk.trim(),
//     {
//       algorithm: "HS256",
//       header: {
//         alg: "HS256",
//         typ: "JWT",
//       },
//     }
//   );
// };

// // const generateJwtToken = (ak: string, sk: string): string => {
// //   const now = Math.floor(Date.now() / 1000);

// //   // 1. Verify system time is correct
// //   console.log("Current timestamp:", now);
// //   console.log("Access Key:", ak);
// //   console.log("Secret Key Length:", sk.length);

// //   // 2. Add all required claims
// //   const payload = {
// //     iss: ak.trim(), // Verified no whitespace
// //     exp: now + 1800, // 30 minutes expiration
// //     nbf: now - 300, // Valid 5 minutes ago (wider window)
// //     iat: now, // Issued at
// //     // Add any API-specific claims if required
// //   };

// //   // 3. More robust Base64URL encoding
// //   const encode = (data: string) => {
// //     return btoa(data)
// //       .replace(/\+/g, "-")
// //       .replace(/\//g, "_")
// //       .replace(/=+$/, "");
// //   };

// //   const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
// //   const payloadEncoded = encode(JSON.stringify(payload));

// //   // 4. Verify signature calculation
// //   const signature = HmacSHA256(
// //     `${header}.${payloadEncoded}`,
// //     sk.trim()
// //   ).toString(enc.Base64url);

// //   const token = `${header}.${payloadEncoded}.${signature}`;

// //   console.log("Final Token Parts:", { header, payloadEncoded, signature });
// //   return token;
// // };

// export const convertImageToBase64 = async (uri: string): Promise<string> => {
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onerror = reject;
//     reader.onload = () => {
//       if (typeof reader.result === "string") {
//         const base64String = reader.result.split(",")[1] || reader.result;
//         resolve(base64String);
//       } else {
//         reject(new Error("Failed to read image as base64"));
//       }
//     };
//     reader.readAsDataURL(blob);
//   });
// };
