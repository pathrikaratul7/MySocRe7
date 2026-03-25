import { useEffect, useState } from "react";
import { GetAllGuestListAPI } from "../api/authApi";

interface guestlist
{

    gid: number | string,
    gName: string,
    gMobile: string,
    gEmail: string,
    inDateTime: string,
    outDateTime :string,
    fid:string | number,
    status:string,
    isDeleted: boolean,
    createdBy: string,
    createdDateTime: string,
    updatedBy: string,
    updatedDateTime: string,
    floorNumber:  string,
    flatNumber: string,
    flatType: string,
    gImagePath: string,
    flatOwnerMobile: string,
    creatorMobile: string,
    loginID: number | string,
    flag : string

}

export const GetAllGuestList= (uid:string) => {
   const [guestlist, setUser] = useState<guestlist[]>([]);

  useEffect(() => {
    const fetchAllguestDetails = async () => 
    {
      try{
      const data: guestlist[] = await GetAllGuestListAPI(
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