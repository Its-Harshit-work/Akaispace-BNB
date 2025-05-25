import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function calculateFileHash(file: File) {
  const buffer = await file.arrayBuffer(); // Read file as ArrayBuffer
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer); // Compute SHA-256 hash
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(""); // Convert to hex string
}

export async function checkUserSession(
  accessToken: string | undefined,
  refreshToken: string | undefined
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/auth-status`,
      {
        method: "GET",
        headers: {
          Cookie: `refreshToken=${refreshToken || ""};accessToken=${
            accessToken || ""
          }`,
        },
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    return data.status; // Expecting { status: true } from the backend
  } catch (error) {
    // More detailed error logging
    if (error instanceof TypeError && error.message.includes("fetch failed")) {
      console.error(
        "Backend connection failed. Please check if the backend server is running."
      );
    } else {
      console.error("Error checking session:", error);
    }
    return false;
  }
}

export const getUserData = async (
  refreshToken: string | undefined,
  accessToken: string | undefined
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/get-user`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken || ""};accessToken=${
            accessToken || ""
          }`,
        },
      }
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getProject = async (
  refreshToken: string | undefined,
  accessToken: string | undefined,
  projectId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/${projectId}`,
      {
        method: "GET",
        headers: {
          Cookie: `refreshToken=${refreshToken || ""};accessToken=${
            accessToken || ""
          }`,
        },
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    return data.project[0];
  } catch (error) {
    console.error("Error fetching project: ", error);
  }
};

export const getDatasetById = async (
  refreshToken: string | undefined,
  accessToken: string | undefined,
  datasetId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/dataset/get-by-id/${datasetId}`,
      {
        method: "GET",
        headers: {
          Cookie: `refreshToken=${refreshToken || ""};accessToken=${
            accessToken || ""
          }`,
        },
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching dataset from marketplace: ", error);
  }
};
