import { useParams } from "react-router-dom";
import { GetAllUser } from "../utils/useUser";
import UserImage from "./UserImage";
import "../styles/Image.css";

const UserEdit: React.FC = () => {
  const { id } = useParams();
  const userId = id ? parseInt(id) : 0;

  const users = GetAllUser(userId.toString()); // get all users
  const user = users.find((u) => u.uid === userId);

  return (
    <div>
      <h1>User Edit Page</h1>
      <p>User ID: {userId}</p>

      {user ? (
        <>
          <p>User Name: {user.uName}</p>
          <p>Email: {user.uEmail}</p>
          <p>Mobile: {user.uMobile}</p>
          <p>Password: {user.uPass}</p>
          <p>Last Updated By : {user.updatedBy || "ADMIN"}</p>
          <p>Last updated Date Time : {user.updatedDateTime}</p>
          <p>Flat ID : {user.fid}</p>
          <p>Roles : {user.privList}</p>
          <p> Profile Picture</p>
            <p>
 
<UserImage src={user.imagePath} />
</p>
          <p>User Type : {user.userType}</p>
         
        </>
      ) : (
        <p>User not found 😔</p>
      )}
    </div>
  );
};

export default UserEdit;