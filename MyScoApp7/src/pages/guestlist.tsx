import { useState } from "react";
import { GetAllGuestList } from "../utils/guestutil";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";
const Guestlist: React.FC = () => {
  const navigate = useNavigate();
  const glist = GetAllGuestList("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = glist.filter((u) =>
    u.gName.toLowerCase().includes(search.toLowerCase()) ||
    u.gEmail.toLowerCase().includes(search.toLowerCase()) ||
    u.gMobile.includes(search)
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (gid: number | string) => {
    console.log("Edit Guest:", gid);
      navigate(`/guest-edit/${gid}`);
  };

  const handleDelete = (gid : number | string) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      console.log("Delete guest:", gid);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">👥 Guest Management</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search Guest..."
        className="search-box"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {glist.length === 0 ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {/* Table */}
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>GID</th>
                  <th>GName</th>
                  <th>GMobile</th>
                  <th>GEmail</th>
                  <th>inDateTime</th>
                  <th>outDateTime</th>
                  
                  <th>Status</th>
                  
                  <th>Floor Number</th>
                  <th>Flat Number</th>
                  <th>Flat Type</th>
                  <th>Guest Image</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((glist) => (
                  <tr key={glist.gid}>
                    <td>{glist.gid}</td>
                    <td>{glist.gName}</td>
                    <td>{glist.gMobile}</td>
                    <td>{glist.gEmail}</td>
                    <td>{glist.inDateTime}</td>
                    <td>{glist.outDateTime}</td>
                    
                    
                    <td>
                      <span className="role-badge">{glist.status}</span>
                    </td>
                    
                    <td>{glist.floorNumber}</td>
                    <td>{glist.flatNumber}</td>
                    <td>{glist.flatType}</td>
                    <td>
                     <UserImage src={glist.gImagePath} />
                    </td>

                    <td>
                      <button
                        className="btn edit-btn"
                        onClick={() => handleEdit(glist.gid)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(glist.gid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="no-data">
                      No users found 😔
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ⬅ Prev
            </button>

            <span>
              Page {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
 

);
  
};


export default Guestlist;