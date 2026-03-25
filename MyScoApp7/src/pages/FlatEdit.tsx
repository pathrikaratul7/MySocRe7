import type React from "react";
import { useParams } from "react-router-dom";
import { GetAllFlatList  } from "../utils/flatlistutil";


const FlatEdit : React.FC = () =>

    {
  const { id } = useParams();
  const FID = id ? parseInt(id) : 0;

  
    const Flats = GetAllFlatList("");
    const flat = Flats.find((u) => u.fid === FID);

return (
    <div className="user-edit-container">
      <div className="user-card">
        <h2 className="title">👤 Flat Details</h2>

        {flat ? (
          <>
            <div className="profile-section">
              
              <h3>{flat.ownerName}</h3>
              
            </div>

            <div className="info-grid">
              <div className="info-box">
                <label>Floor Number</label>
                <p>{flat.floorNumber}</p>
              </div>

              <div className="info-box">
                <label>Flat Number</label>
                <p>{flat.flatNumber}</p>
              </div>

              <div className="info-box">
                <label>Flat Type</label>
                <p>{flat.flatType}</p>
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

    export default FlatEdit;