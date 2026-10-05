import { useState } from "react";
import { GetAllGuestList } from "../utils/guestutil";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useCanManageUsers } from "../utils/useUser";
const Guestlist: React.FC = () => {
  const navigate = useNavigate();
  const canManageUsers = useCanManageUsers();
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
    Swal.fire({
  title: "Edit Guest Entry ✏️",
  text: "Do you want to modify this guest's details?",
  icon: "question",
    background: "#1e1e2f",
  color: "#ffffff",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, Edit",
  cancelButtonText: "Cancel"
}).then((result) => {
  if (result.isConfirmed) {
    navigate(`/guest-edit/${gid}`);
  }
});
  };

  const handleDelete = (gid : number | string) => {
    Swal.fire({
  title: "Delete Guest Entry 🗑️",
  text: "Do you want to delete this guest's details?",
  icon: "warning",
  background: "#1e1e2f",
  color: "#ffffff",
  showCancelButton: true,
  confirmButtonColor: "#e53935",
  cancelButtonColor: "#6c757d",
  confirmButtonText: "Yes, Delete",
  cancelButtonText: "Cancel"
}).then((result) => {
  if (result.isConfirmed) {
    navigate(`/guest-edit/${gid}`);
  }
});
  };


  return (
    <div className="users-container">
      <h2 className="users-title">👥 Guest Management</h2>

      
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
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                      {canManageUsers && (
                        <button
                          className="btn delete-btn"
                          onClick={() => handleDelete(glist.gid)}
                          title="Delete"
                        >
                          <FaDeleteLeft/>
                        </button>
                      )}
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