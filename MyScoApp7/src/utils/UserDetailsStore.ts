
export const StoreUserDetails = (userDetails: object) => {
  sessionStorage.setItem("user", JSON.stringify(userDetails));
}