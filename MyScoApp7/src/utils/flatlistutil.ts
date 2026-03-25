import { useEffect, useState } from "react";
import {GetAllFlatAPI} from "../api/authApi"

interface flatlistmodel
{

    fid: number | string,
    ownerName : string,
    floorNumber :string,
    flatNumber:string,
    flatType : string,
    isDeleted:boolean,
    createdBy : string,
    createdDateTime: string,
    updatedBy:string,
    updatedDateTime:string,
    loginID:number | string,
    uid:number | string,
    flag: string

}

   
   export const GetAllFlatList= (uid:string) => {
      const [flatlistmodel, setUser] = useState<flatlistmodel[]>([]);
   
     useEffect(() => {
       const fetchAllFlatDetails = async () => 
       {
         try{
         const data: flatlistmodel[] = await GetAllFlatAPI(
           localStorage.getItem("token") || "",uid.length > 0 ? uid : localStorage.getItem("uid") || ""
       );
       setUser(data);
     }
      catch (error) {
           console.error(error);
         }
     };
   fetchAllFlatDetails();
       },[uid]);
   
       return flatlistmodel;
     };

