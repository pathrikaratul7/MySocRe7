import { useParams } from "react-router-dom";
import { GetAllUser } from "../utils/useUser";
import UserImage from "./UserImage";
import "../styles/UserEdit.css";

const UserEdit: React.FC = () => {
  const { id } = useParams();
  const userId = id ? parseInt(id) : 0;

  const users = GetAllUser("");
  const user = users.find((u) => u.uid === userId);

  return (
    <div className="user-edit-container">
      <div className="user-card">
        <h2 className="title">👤 User Details</h2>

        {user ? (
          <>
            <div className="profile-section">
              <UserImage src={user.imagePath} />
              <h3>{user.uName}</h3>
              <span className="badge">{user.userType}</span>
            </div>

            <div className="info-grid">
              <div className="info-box">
                <label>Email</label>
                <p>{user.uEmail}</p>
              </div>

              <div className="info-box">
                <label>Mobile</label>
                <p>{user.uMobile}</p>
              </div>

              <div className="info-box">
                <label>Password</label>
                <p>••••••••</p>
              </div>

              <div className="info-box">
                <label>Flat ID</label>
                <p>{user.fid}</p>
              </div>

              <div className="info-box">
                <label>Roles</label>
                <p>{user.privList}</p>
              </div>

              <div className="info-box">
                <label>Last Updated By</label>
                <p>{user.updatedBy || "ADMIN"}</p>
              </div>

              <div className="info-box">
                <label>Updated Date</label>
                <p>{user.updatedDateTime}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="not-found">User not found 😔</p>
        )}
      </div>
    </div>
  );
};

export default UserEdit;