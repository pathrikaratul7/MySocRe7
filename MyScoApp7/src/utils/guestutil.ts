import { useEffect, useState } from "react";
import { GetAllGuestListAPI, type GuestRecord } from "../api/authApi";

export const GetAllGuestList= (uid:string) => {
   const [guestlist, setUser] = useState<GuestRecord[]>([]);

  useEffect(() => {
    const fetchAllguestDetails = async () => 
    {
      try{
      const data = await GetAllGuestListAPI(
        localStorage.getItem("token") || "",uid.length > 0 ? uid : localStorage.getItem("uid") || ""
    );
    setUser(data);
  }
   catch (error) {
        console.error(error);
      }
  };
fetchAllguestDetails();
    },[uid]);

    return guestlist;
  };