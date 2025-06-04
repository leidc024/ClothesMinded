import { HmacSHA256, enc } from "crypto-js";
import { encode as btoa } from "base-64";
import { storage } from "../lib/appwrite_2";

interface KlingConfig {
  KLING_API_KEY_ID: string;
  KLING_API_SECRET: string;
}

interface TaskResponse {
  data: {
    task_id: string;
    task_status: string;
    task_status_msg?: string;
    task_result?: {
      images: Array<{ url: string }>;
    };
  };
}

const API_BASE_URL = "https://api.klingai.com/v1/images/kolors-virtual-try-on";

export const generateVirtualTryOn = async (
  humanImage: string,
  clothImage: string | null,
  config: KlingConfig,
  options?: {
    humanImageBucket?: string;
    clothImageBucket?: string;
  }
): Promise<string[]> => {
  try {
    if (!humanImage) throw new Error("Human image is required");
    
    console.log("STARTING IMAGE CONVERSION")
    // Convert images to base64
    const [humanImageBase64, clothImageBase64] = await Promise.all([
      convertToBase64(humanImage, options?.humanImageBucket),
      clothImage
        ? convertToBase64(clothImage, options?.clothImageBucket)
        : Promise.resolve(null),
    ]);
    console.log("FINISHED IMAGE CONVERSION");
    
    const payload: Record<string, string> = {
      model_name: "kolors-virtual-try-on-v1-5",
      human_image: humanImageBase64,
    };

    if (clothImageBase64) {
      payload.cloth_image = clothImageBase64;
    }

    const token = generateJwtToken(
      config.KLING_API_KEY_ID,
      config.KLING_API_SECRET
    );

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: TaskResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.data?.task_status_msg ||
          `API request failed with status ${response.status}`
      );
    }

    if (!data.data?.task_id) {
      throw new Error("Invalid response format - missing task_id");
    }

    return await pollForTaskResult(data.data.task_id, token);
  } catch (error) {
    console.error("Virtual Try-On Error:", error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

// Updated blobToBase64 function with proper type checking
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    // First verify it's actually a Blob
    if (!(blob instanceof Blob)) {
      reject(new Error("Input must be a Blob object"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read blob data"));
      }
    };
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
};

// Updated convertToBase64 function with proper URL handling
const convertToBase64 = async (
  image: string, // Accepts string URL or base64
  bucketId?: string
): Promise<string> => {
  try {
    // Case 1: Already base64
    if (/^[A-Za-z0-9+/=]+$/.test(image)) {
      return image;
    }

    console.log("getting appwrite file");
    
    let blob: Blob;
    
    // Case 2: Appwrite file
    if (bucketId) {
      blob = await storage.getFileView(bucketId, image);
    }
    // Case 3: Regular URL
    else {
      const response = await fetch(image);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      blob = await response.blob();
    }

    const dataUrl = await blobToBase64(blob);
    return dataUrl.split(",")[1]; // Return only the base64 part
  } catch (error) {
    console.error("Image conversion failed:", error);
    throw new Error(
      `Failed to process image: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

const pollForTaskResult = async (
  taskId: string,
  token: string
): Promise<string[]> => {
  const maxAttempts = 12;
  const delayMs = 10000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0)
      await new Promise((resolve) => setTimeout(resolve, delayMs));

    const result = await checkTaskStatus(taskId, token);
    console.log(`Polling attempt ${attempt + 1}:`, result);

    if (result.task_status === "succeed") {
      if (result.task_result?.images?.length) {
        return result.task_result.images.map((img) => img.url);
      }
      throw new Error("Missing image URLs in successful response");
    } else if (result.task_status === "failed") {
      throw new Error(result.task_status_msg || "Try-on failed");
    }
  }

  throw new Error("Try-on timed out");
};

const checkTaskStatus = async (taskId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/${taskId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: TaskResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.data?.task_status_msg || `Status check failed: ${response.status}`
    );
  }

  if (!data.data) {
    throw new Error("Invalid task status response format");
  }

  return data.data;
};

const generateJwtToken = (apiKeyId: string, apiKeySecret: string): string => {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: apiKeyId.trim(),
    exp: now + 1800,
    nbf: now - 5,
  };

  const encodeBase64Url = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const encodedHeader = encodeBase64Url(header);
  const encodedPayload = encodeBase64Url(payload);

  const signature = HmacSHA256(
    `${encodedHeader}.${encodedPayload}`,
    apiKeySecret.trim()
  )
    .toString(enc.Base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Optional: Keep this if you need it elsewhere
export const convertImageToBase64 = async (
  uri: string,
  headers?: Record<string, string>
): Promise<string> => {
  const response = await fetch(uri, { headers: headers || {} });
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.status}`);
  const blob = await response.blob();
  return blobToBase64(blob);
};
