import { useEffect, useState } from "react";
import { GetAllUsersfromAPp, GetUserDetails } from "../api/authApi";


interface UserData {
  guestVisitor?: number;
  incidentCount?: number;
  ownReconcileAmt?: number;
  overallTotalReconcile?: number;
  ownFailedReconcile?: number;
  overallFailedTotalReconcile?: number;
  createdBy?: string; 
  uName?: string;
  uEmail?: string;
  uMobile?: string;
  uid?: number;
  loginID?: number | null;
  imagePath: string;
  privList?: string | null;

}
interface GetALlUserDATA {
  uid: number;
  uName: string | null;
  uEmail: string | null;
  uPass: string | null;
  uMobile: string | null;
  isDeleted: boolean;
  createdBy: string | null;
  createdDateTime: string | null;
  updatedBy: string | null; //  nullable
  updatedDateTime: string | null; //  nullable
  fid: number | null;
  flatNumber: string | null;
  flatType: string | null;
  deviceID: string | null; //  nullable
  privList: string | null;
  flag: string | null; //  nullable
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
export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data: UserData = await GetUserDetails(
          localStorage.getItem("token") || "",
          localStorage.getItem("uEmail") || "",
          localStorage.getItem("uPass") || ""
        );

        setUser(data);
      } 
      catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  return user;
};

const MANAGEMENT_ROLES = ["Admin", "SuperAdmin", "Developer"] as const;

export const hasAnyPrivilege = (
  privList: string | null | undefined,
  allowedRoles: readonly string[]
): boolean => {
  const roles = new Set(allowedRoles.map((role) => role.toLowerCase()));

  return (privList || "")
    .split("|")
    .map((privilege) => privilege.trim().toLowerCase())
    .some((privilege) => roles.has(privilege));
};

export const useCanManageUsers = (): boolean => {
  const user = useUser();

  return hasAnyPrivilege(user?.privList, MANAGEMENT_ROLES);
};

export const GetAllUser= (uid:string) => {
   const [getuser, setUser] = useState<GetALlUserDATA[]>([]);

  useEffect(() => {
    const fetchAllUserDetails = async () => 
    {
      try{
      const data: GetALlUserDATA[] = await GetAllUsersfromAPp(
        localStorage.getItem("token") || "",uid.length > 0 ? uid : localStorage.getItem("uid") || ""
    );
    setUser(data);
  }
   catch (error) {
        console.error(error);
      }
  };
fetchAllUserDetails();
    },[uid]);

    return getuser;
  };
