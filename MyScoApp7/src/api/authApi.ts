import axios from "axios";

const API_URL = "https://mysoc7.runasp.net/api";

/* =========================================================
   LOGIN
========================================================= */

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/Token`, {
    uEmail: email,
    uPass: password,
    Flag: "LOG",
  });

  return response.data;
};

/* =========================================================
   GET USER DETAILS
========================================================= */

export const GetUserDetails = async (
  token: string,
  email: string,
  password: string
) => {
  const response = await axios.post(
    `${API_URL}/SocietyUser/GetLogin`,
    {
      uEmail: email,
      uPass: password,
      Flag: "LOG",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* =========================================================
   GET ALL USERS
========================================================= */

export const GetAllUsersfromAPp = async (
  token: string,
  uid: string
) => {
  const response = await axios.post(
    `${API_URL}/SocietyUser/GetAllUsers`,
    {
      uid,
      Flag: "Report",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* =========================================================
   GET ALL GUEST LIST
========================================================= */

export const GetAllGuestListAPI = async (
  token: string,
  loginID: string
) => {
  const response = await axios.post(
    `${API_URL}/Guest/GetAllGuestList`,
    {
      loginID,
      Flag: "Report",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* =========================================================
   GET ALL FLATS
========================================================= */

export const GetAllFlatAPI = async (
  token: string,
  uid: string
) => {
  const response = await axios.post(
    `${API_URL}/Flat/GetAllFlat`,
    {
      uid,
      Flag: "Report",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* =========================================================
   PRE FLAT
   JWT TOKEN IS NOT REQUIRED
========================================================= */

export interface PreFlat {
  fid: number;

  ownerName: string;

  floorNumber: string;

  flatNumber: string;

  flatType: string;

  /*
   * Your current API response does not show email.
   * These optional fields allow autocomplete to work
   * automatically if API starts returning them.
   */
  email?: string | null;

  ownerEmail?: string | null;

  mobile?: string | null;

  ownerMobile?: string | null;

  flatOwnerMobile?: string | null;

  isDeleted: boolean | null;

  createdBy: string;

  createdDateTime: string;

  updatedBy: string | null;

  updatedDateTime: string;

  loginID: number;

  uid: number | null;

  flag: string | null;
}

/* =========================================================
   PRE GET ALL FLAT

   IMPORTANT:
   No Authorization header.
   No JWT token required.
========================================================= */

export const PreGetAllFlatAPI = async (): Promise<PreFlat[]> => {
  const response = await axios.post(
    `${API_URL}/PreFlat/PreGetAllFlat`,
    {
      fid: 0,
      ownerName: "string",
      floorNumber: "string",
      flatNumber: "string",
      flatType: "string",
      isDeleted: true,
      createdBy: "string",
      createdDateTime: new Date().toISOString(),
      updatedBy: "string",
      updatedDateTime: new Date().toISOString(),
      loginID: 0,
      uid: 0,
      flag: "AUTO",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return Array.isArray(response.data)
    ? response.data
    : [];
};

/* =========================================================
   PRE GUEST
========================================================= */

export interface PreGuestRequest {
  gid: number;

  gName: string;

  gMobile: string;

  gEmail: string;

  inDateTime: string;

  outDateTime: string | null;

  fid: number;

  status: string;

  isDeleted: boolean;

  createdBy: string;

  createdDateTime: string;

  updatedBy: string | null;

  updatedDateTime: string;

  floorNumber: string;

  flatNumber: string;

  flatType: string;

  gImagePath: string;

  flatOwnerMobile: string;

  creatorMobile: string;

  loginID: number;

  flag: string;
};

/* =========================================================
   ADD PRE GUEST
========================================================= */

export const PreGuestAddAPI = async (
  preGuestData: PreGuestRequest
) => {
  const response = await axios.post(
    `${API_URL}/PreGuest/PreGuestAdd`,
    preGuestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/* =========================================================
   UPLOAD GUEST IMAGE
========================================================= */

export const UploadGuestImageAPI = async (
  file: File
): Promise<string> => {
  if (!file) {
    throw new Error("Please select a guest image.");
  }

  const formData = new FormData();

  formData.append(
    "file",
    file,
    file.name
  );

  const response = await axios.post(
    `${API_URL}/Guest/guestimg`,
    formData,
    {
      headers: {
        Accept: "*/*",
      },
    }
  );

  const serverFilePath = response.data?.filePath;

  if (!serverFilePath) {
    throw new Error(
      "Guest image upload succeeded but file path was not returned."
    );
  }

  const normalizedPath = String(serverFilePath)
    .replace(/\\/g, "/")
    .trim();

  const imagesIndex = normalizedPath
    .toLowerCase()
    .indexOf("/images/guestimg/");

  if (imagesIndex >= 0) {
    const fileName = normalizedPath
      .substring(imagesIndex)
      .split("/")
      .pop();

    if (fileName) {
      return `/images/GuestImg/${fileName}`;
    }
  }

  const fileName = normalizedPath
    .split("/")
    .pop();

  if (!fileName) {
    throw new Error(
      "Unable to determine uploaded guest image file name."
    );
  }

  return `/images/GuestImg/${fileName}`;
};