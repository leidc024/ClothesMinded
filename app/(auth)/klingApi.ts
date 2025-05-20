import { Storage } from "react-native-appwrite";
import * as Crypto from "expo-crypto";
import Constants from "expo-constants";
import { client } from "@/lib/appwrite";

interface KlingApiConfig {
  KLING_API_KEY_ID: string;
  KLING_API_SECRET: string;
}

interface TaskResult {
  images: Array<{
    url: string;
    index: number;
  }>;
}

interface KlingApiResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    task_status: string;
    task_status_msg?: string;
    task_result?: TaskResult;
    created_at: number;
    updated_at: number;
  };
}

const getConfig = (): KlingApiConfig => {
  const config = {
    KLING_API_KEY_ID: Constants.expoConfig?.extra?.KLING_API_KEY_ID,
    KLING_API_SECRET: Constants.expoConfig?.extra?.KLING_API_SECRET,
  };

  if (!config.KLING_API_KEY_ID || !config.KLING_API_SECRET) {
    throw new Error("Missing Kling API credentials in environment variables");
  }

  return config as KlingApiConfig;
};

const { KLING_API_KEY_ID, KLING_API_SECRET } = getConfig();
const BASE_URL = "https://api.klingai.com/v1/images/kolors-virtual-try-on";
const storage = new Storage(client);

const generateJwtToken = async (): Promise<string> => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: KLING_API_KEY_ID,
    exp: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
    nbf: Math.floor(Date.now() / 1000) - 5, // Active 5 seconds ago
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Create HMAC key first
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    KLING_API_SECRET
  );

  // Then create signature
  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${signatureInput}.${key}`
  );

  return `${encodedHeader}.${encodedPayload}.${base64UrlEncode(signature)}`;
};

const base64UrlEncode = (str: string): string => {
  // For React Native, we need to use this alternative to btoa()
  const base64 = Buffer.from(str).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const urlToBase64 = async (url: string): Promise<string> => {
  try {
    if (url.startsWith("data:")) {
      const parts = url.split(",");
      if (parts.length > 1) return parts[1];
      throw new Error("Invalid data URL format");
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64data = result.split(",")[1];
        if (base64data) {
          resolve(base64data);
        } else {
          reject(new Error("Failed to extract Base64 data"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read blob data"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    throw new Error(
      `Failed to convert image to Base64: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const generateVirtualTryOn = async (
  humanImageUrl: string,
  clothImageUrl: string
): Promise<string> => {
  try {
    // Validate inputs
    if (!humanImageUrl || !clothImageUrl) {
      throw new Error("Both human and clothing images are required");
    }

    const token = await generateJwtToken();
    const [humanImageBase64, clothImageBase64] = await Promise.all([
      urlToBase64(humanImageUrl),
      urlToBase64(clothImageUrl),
    ]);

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model_name: "kolors-virtual-try-on-v1-5",
        human_image: humanImageBase64,
        cloth_image: clothImageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: KlingApiResponse = await response.json();
    if (data.code !== 0) {
      throw new Error(data.message || "API request failed");
    }

    return await pollForTaskResult(data.data.task_id, token);
  } catch (error) {
    console.error("Error in virtual try-on:", error);
    throw error;
  }
};

const pollForTaskResult = async (
  taskId: string,
  token: string
): Promise<string> => {
  const maxAttempts = 12; // 2 minutes max (12 attempts * 10 seconds)

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

      const response = await fetch(`${BASE_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: KlingApiResponse = await response.json();

      if (data.data.task_status === "succeed") {
        if (data.data.task_result?.images?.[0]?.url) {
          return data.data.task_result.images[0].url;
        }
        throw new Error("Missing image URL in successful response");
      } else if (data.data.task_status === "failed") {
        throw new Error(data.data.task_status_msg || "Generation failed");
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(
          `Timeout waiting for result: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  throw new Error("Timeout waiting for virtual try-on result");
};

// // lib/klingApi.ts
// import { client } from "@/lib/appwrite";
// import { Storage } from "react-native-appwrite";
// import jwt from "jsonwebtoken";

// interface KlingApiConfig {
//   KLING_API_KEY_ID: string;
//   KLING_API_SECRET: string;
// }

// interface TaskResult {
//   images: Array<{
//     url: string;
//     index: number;
//   }>;
// }

// interface KlingApiResponse {
//   code: number;
//   message: string;
//   data: {
//     task_id: string;
//     task_status: string;
//     task_status_msg?: string;
//     task_result?: TaskResult;
//     created_at: number;
//     updated_at: number;
//   };
// }

// const storage = new Storage(client);
// const bucketId = "6825d9f500066a3dc28e";

// const generateJwtToken = (apiKeyId: string, apiSecret: string): string => {
//   return jwt.sign(
//     {
//       iss: apiKeyId,
//       exp: Math.floor(Date.now() / 1000) + 1800,
//       nbf: Math.floor(Date.now() / 1000) - 5,
//     },
//     apiSecret,
//     { algorithm: "HS256" }
//   );
// };

// export const generateVirtualTryOn = async (
//   humanImageUrl: string,
//   clothImageUrl: string,
//   config: KlingApiConfig
// ): Promise<string> => {
//   try {
//     const humanImageBase64 = await urlToBase64(humanImageUrl);
//     const clothImageBase64 = await urlToBase64(clothImageUrl);
//     const token = generateJwtToken(
//       config.KLING_API_KEY_ID,
//       config.KLING_API_SECRET
//     );

//     const response = await fetch(
//       "https://api.klingai.com/v1/images/kolors-virtual-try-on",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           model_name: "kolors-virtual-try-on-v1-5",
//           human_image: humanImageBase64,
//           cloth_image: clothImageBase64,
//         }),
//       }
//     );

//     const data: KlingApiResponse = await response.json();

//     if (data.code !== 0) {
//       throw new Error(data.message || "API request failed");
//     }

//     return await pollForTaskResult(data.data.task_id, token);
//   } catch (error) {
//     console.error("Error in virtual try-on:", error);
//     throw error;
//   }
// };

// const pollForTaskResult = async (
//   taskId: string,
//   token: string
// ): Promise<string> => {
//   const maxAttempts = 12;
//   let attempts = 0;

//   while (attempts < maxAttempts) {
//     attempts++;
//     await new Promise((resolve) => setTimeout(resolve, 10000));

//     const response = await fetch(
//       `https://api.klingai.com/v1/images/kolors-virtual-try-on/${taskId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data: KlingApiResponse = await response.json();

//     if (
//       data.data.task_status === "succeed" &&
//       data.data.task_result?.images?.[0]?.url
//     ) {
//       return data.data.task_result.images[0].url;
//     } else if (data.data.task_status === "failed") {
//       throw new Error(data.data.task_status_msg || "Generation failed");
//     }
//   }

//   throw new Error("Timeout waiting for virtual try-on result");
// };

// const urlToBase64 = async (url: string): Promise<string> => {
//   if (url.startsWith("data:")) return url.split(",")[1];

//   const response = await fetch(url);
//   const blob = await response.blob();

//   return new Promise<string>((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64data = reader.result?.toString().split(",")[1];
//       base64data ? resolve(base64data) : reject(new Error("Conversion failed"));
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// };
