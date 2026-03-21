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
    Flag:"Report"},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
return response.data;

}