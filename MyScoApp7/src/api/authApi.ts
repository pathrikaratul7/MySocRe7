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
): Promise<SocietyUserRecord[]> => {
  const response = await axios.post<SocietyUserRecord[]>(
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

export interface SocietyUserRequest {
  uid: number;
  uName: string;
  uEmail: string;
  uPass?: string;
  uMobile: string;
  isDeleted: boolean;
  createdBy: string;
  createdDateTime: string;
  updatedBy: string | null;
  updatedDateTime: string | null;
  fid: number;
  flatNumber: string;
  flatType: string;
  deviceID: string | null;
  privList: string;
  flag: "IN" | "UP";
  guestVisitor: number;
  incidentCount: number;
  imagePath: string;
  userType: string;
  ownReconcileAmt: number;
  ownFailedReconcile: number;
  overallTotalReconcile: number;
  overallFailedTotalReconcile: number;
  pendingTranCount: number;
}

export interface SocietyUserRecord {
  uid: number;
  uName: string | null;
  uEmail: string | null;
  uPass: string | null;
  uMobile: string | null;
  isDeleted: boolean;
  createdBy: string | null;
  createdDateTime: string | null;
  updatedBy: string | null;
  updatedDateTime: string | null;
  fid: number | null;
  flatNumber: string | null;
  flatType: string | null;
  deviceID: string | null;
  privList: string | null;
  flag: string | null;
  guestVisitor: number;
  incidentCount: number;
  imagePath: string | null;
  userType: string | null;
  ownReconcileAmt: number;
  ownFailedReconcile: number;
  overallTotalReconcile: number;
  overallFailedTotalReconcile: number;
  pendingTranCount: number;
}

const saveSocietyUser = async (
  endpoint: "AddUser" | "UpdateUser",
  userData: SocietyUserRequest
): Promise<SocietyUserRecord> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await axios.post<SocietyUserRecord>(
    `${API_URL}/SocietyUser/${endpoint}`,
    userData,
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const AddUserAPI = async (
  userData: SocietyUserRequest
): Promise<SocietyUserRecord> => saveSocietyUser("AddUser", userData);

export const UpdateUserAPI = async (
  userData: SocietyUserRequest
): Promise<SocietyUserRecord> => saveSocietyUser("UpdateUser", userData);

export interface FlatOwnerOption {
  uid: number;
  uName: string;
  uEmail: string | null;
  uMobile: string | null;
  isDeleted: boolean;
  userType: string | null;
}

export const GetFlatOwnerOptionsAPI = async (
  token: string
): Promise<FlatOwnerOption[]> => {
  const response = await axios.post<FlatOwnerOption[]>(
    `${API_URL}/SocietyUser/GetAllUsers`,
    {
      uid: 0,
      uName: "string",
      uEmail: "user@example.com",
      uPass: "string",
      uMobile: "string",
      isDeleted: true,
      createdBy: "string",
      createdDateTime: new Date().toISOString(),
      updatedBy: "string",
      updatedDateTime: new Date().toISOString(),
      fid: 0,
      flatNumber: "string",
      flatType: "string",
      deviceID: "string",
      privList: "string",
      flag: "AUTO",
      guestVisitor: 0,
      incidentCount: 0,
      imagePath: "string",
      userType: "string",
      ownReconcileAmt: 0,
      ownFailedReconcile: 0,
      overallTotalReconcile: 0,
      overallFailedTotalReconcile: 0,
      pendingTranCount: 0,
    },
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!Array.isArray(response.data)) {
    throw new Error("The user autocomplete API returned an invalid response.");
  }

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

export interface FlatRequest {
  fid: number;
  ownerName: string;
  floorNumber: string;
  flatNumber: string;
  flatType: string;
  isDeleted: boolean;
  createdBy: string;
  createdDateTime: string;
  updatedBy: string | null;
  updatedDateTime: string | null;
  loginID: number;
  uid: number;
  flag: "IN" | "UP" | "DE";
}

export interface FlatResponse extends Omit<FlatRequest, "flag" | "uid"> {
  uid: number | null;
  flag: string | null;
}

export const AddFlatAPI = async (
  flatData: FlatRequest
): Promise<FlatResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await axios.post<FlatResponse>(
    `${API_URL}/Flat/AddFlat`,
    flatData,
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const UpdateFlatAPI = async (
  flatData: FlatRequest
): Promise<FlatResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await axios.post<FlatResponse>(
    `${API_URL}/Flat/UpdateFlat`,
    flatData,
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const DeleteFlatAPI = async (
  flatData: FlatRequest
): Promise<FlatResponse | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await axios.delete<FlatResponse | null>(
    `${API_URL}/Flat/DeleteFlat`,
    {
      data: flatData,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data ?? null;
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