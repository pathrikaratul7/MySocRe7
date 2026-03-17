import { useEffect, useState } from "react";
import { GetUserDetails } from "../api/authApi";

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
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  return user;
};