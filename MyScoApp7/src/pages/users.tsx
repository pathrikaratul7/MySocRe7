import React, { useState } from "react";
import { GetAllUser } from "../utils/useUser";
import "../styles/users.css";
import "../styles/Image.css";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
const Users: React.FC = () => {
  const navigate = useNavigate();
  const users = GetAllUser("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = users.filter((u) =>
    (u.uName || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.uEmail || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.uMobile || "").includes(search)
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (gid: number | string) => {
      Swal.fire({
    title: "Edit User Entry ✏️",
    text: "Do you want to modify this User's details?",
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
      navigate(`/user-edit/${gid}`);
    }
  });
    };
  
    const handleDelete = (gid : number | string) => {
      Swal.fire({
    title: "Delete User Entry 🗑️",
    text: "Do you want to delete this User's details?",
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
      navigate(`/user-edit/${gid}`);
    }
  });
    };

  return (
    <div className="users-container">
      <h2 className="users-title">👥 Users Management</h2>

      
      <input
        type="text"
        placeholder="Search users..."
        className="search-box"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {users.length === 0 ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {/* Table */}
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>User Type</th>
                  <th>Roles</th>
                  <th>Profile Pic</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.uid}</td>
                    <td>{user.uName}</td>
                    <td>{user.uEmail}</td>
                    <td>{user.uMobile}</td>
                    <td>{user.userType}</td>
                    <td>
                      <span className="role-badge">{user.privList}</span>
                    </td>
                    <td>
                     <UserImage src={user.imagePath} />
                    </td>

                    <td>
                     <button
  className="btn edit-btn"
  onClick={() => handleEdit(user.uid)}
  title="Edit"
>
  <FaEdit />
</button>

                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(user.uid)} title="Delete"
                      >
                        <FaDeleteLeft/>
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


export default Users;