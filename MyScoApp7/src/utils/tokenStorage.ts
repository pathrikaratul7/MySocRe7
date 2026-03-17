export const saveToken = (token: string, email: string, password: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("uEmail", email);
  localStorage.setItem("uPass", password);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

