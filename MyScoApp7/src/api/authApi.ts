import axios from "axios";

const API_URL = "https://mysoc7.runasp.net/api";

// =====================================================
// Login
// =====================================================

export const login = async (
  email: string,
  password: string
) => {
  const response = await axios.post(
    `${API_URL}/Token`,
    {
      uEmail: email,
      uPass: password,
      Flag: "LOG",
    }
  );

  return response.data;
};

// =====================================================
// Get Login User Details
// =====================================================

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

// =====================================================
// Get All Users
// =====================================================

export const GetAllUsersfromAPp = async (
  token: string,
  uid: string
) => {
  const response = await axios.post(
    `${API_URL}/SocietyUser/GetAllUsers`,
    {
      uid: uid,
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

// =====================================================
// Get All Guest List
// =====================================================

export const GetAllGuestListAPI = async (
  token: string,
  loginID: string
) => {
  const response = await axios.post(
    `${API_URL}/Guest/GetAllGuestList`,
    {
      loginID: loginID,
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

// =====================================================
// Get All Flats
// =====================================================

export const GetAllFlatAPI = async (
  token: string,
  uid: string
) => {
  const response = await axios.post(
    `${API_URL}/Flat/GetAllFlat`,
    {
      uid: uid,
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

// =====================================================
// Pre Guest Add
// =====================================================

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
}

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

// =====================================================
// Guest Image Upload
// POST /api/Guest/guestimg
// =====================================================

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

  const serverFilePath =
    response.data?.filePath;

  if (!serverFilePath) {
    throw new Error(
      "Guest image upload succeeded but file path was not returned."
    );
  }

  /*
   * Current API may return:
   *
   * D:\Sites\site48923\wwwroot\Images\GuestImg\about-bg.jpg
   *
   * or:
   *
   * /images/GuestImg/about-bg.jpg
   *
   * We convert both formats into:
   *
   * /images/GuestImg/about-bg.jpg
   */

  const normalizedPath =
    String(serverFilePath)
      .replace(/\\/g, "/")
      .trim();

  // ---------------------------------------------------
  // If backend already returned /images/GuestImg/...
  // ---------------------------------------------------

  const imagesIndex =
    normalizedPath
      .toLowerCase()
      .indexOf("/images/guestimg/");

  if (imagesIndex >= 0) {
    const fileName =
      normalizedPath
        .substring(imagesIndex)
        .split("/")
        .pop();

    if (fileName) {
      return `/images/GuestImg/${fileName}`;
    }
  }

  // ---------------------------------------------------
  // If backend returned physical Windows path
  // ---------------------------------------------------

  const fileName =
    normalizedPath
      .split("/")
      .pop();

  if (!fileName) {
    throw new Error(
      "Unable to determine uploaded guest image file name."
    );
  }

  return `/images/GuestImg/${fileName}`;
};
