import axios from "axios";

const API_URL = "https://mysoc7.runasp.net/api";

  export const login = async(email:string, password:string) => {
const response = await axios.post(`${API_URL}/Token`,
     {
        uEmail : email,
  uPass: password,
    Flag:"LOG"});
return response.data;
}

export const GetUserDetails = async(token:string,email:string,password:string) =>{
const response = await axios.post(`${API_URL}/SocietyUser/GetLogin`,
     {
        uEmail : email,
  uPass: password,
    Flag:"LOG"},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
return response.data;


}

export const GetAllUsersfromAPp= async(token: string,uid: string ) =>{
const response = await axios.post(`${API_URL}/SocietyUser/GetAllUsers`,
     {
        uid : uid,
    Flag:"Report"
  },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
return response.data;

}

export const GetAllGuestListAPI = async(token: string, loginID:string) => {
const response = await axios.post(`${API_URL}/Guest/GetAllGuestList`,
{
  loginID : loginID,
  Flag :"Report"
},
{
headers:
{
  Authorization: `Bearer ${token}`
}
});
return response.data;

}
export const GetAllFlatAPI = async(token:string , uid:string)=>{

  const response = await axios.post(`${API_URL}/Flat/GetAllFlat`,
{
uid:uid,
Flag: "Report"
},
{
headers: {Authorization: `Bearer ${token}`}});

return response.data;

}

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
