export const saveToken = (token: string, email: string, 
  password: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("uEmail", email);
  localStorage.setItem("uPass", password);
  
};
export const saveUID = (uid: number) =>
{
localStorage.setItem("uid",uid.toString());

};
export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUid = () => {
  return localStorage.getItem("uid");
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("uEmail");
  localStorage.removeItem("uPass");
  localStorage.removeItem("uid");
};

