import type React from "react";
import { useParams } from "react-router-dom";
import { GetAllGuestList } from "../utils/guestutil";
import UserImage from "./UserImage";

const GuestEdit : React.FC = () =>

    {
  const { id } = useParams();
  const GuestID = id ? parseInt(id) : 0;

  
    const guests = GetAllGuestList("");
    const guest = guests.find((u) => u.gid === GuestID);

return (
    <div className="user-edit-container">
      <div className="user-card">
        <h2 className="title">👤 Guest Details</h2>

        {guest ? (
          <>
            <div className="profile-section">
              <UserImage src={guest.gImagePath} />
              <h3>{guest.gName}</h3>
              <span className="badge">{guest.status}</span>
            </div>

            <div className="info-grid">
              <div className="info-box">
                <label>Email</label>
                <p>{guest.gEmail}</p>
              </div>

              <div className="info-box">
                <label>Mobile</label>
                <p>{guest.gMobile}</p>
              </div>

              <div className="info-box">
                <label>Visited Floor Number</label>
                <p>{guest.floorNumber}</p>
              </div>

              <div className="info-box">
                <label>Visited Flat Number</label>
                <p>{guest.flatNumber}</p>
              </div>
               <div className="info-box">
                <label>Visited Flat Type</label>
                <p>{guest.flatType}</p>
              </div>

              <div className="info-box">
                <label>Status</label>
                <p>{guest.status}</p>
              </div>

              <div className="info-box">
                <label>In Date Time</label>
                <p>{guest.inDateTime}</p>
              </div>

              <div className="info-box">
                <label>Out Date Time</label>
                <p>{guest.outDateTime}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="not-found">Guest not found 😔</p>
        )}
      </div>
    </div>
  );


    };

    export default GuestEdit;