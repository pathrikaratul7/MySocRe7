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
  uid?: number;
  imagePath: string;

}
interface GetALlUserDATA {
  uid: number;
  uName: string;
  uEmail: string;
  uPass: string;
  uMobile: string;
  isDeleted: boolean;
  createdBy: string;
  createdDateTime: string; //  string, not Date
  updatedBy: string | null; //  nullable
  updatedDateTime: string | null; //  nullable
  fid: number; // was string → fix
  flatNumber: string;
  flatType: string;
  deviceID: string | null; //  nullable
  privList: string;
  flag: string | null; //  nullable
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
