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