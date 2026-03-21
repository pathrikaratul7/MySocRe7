import React, { useState } from "react";
import { GetAllUser } from "../utils/useUser";
import "../styles/users.css";

const Users: React.FC = () => {
  const users = GetAllUser();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = users.filter((u) =>
    u.uName.toLowerCase().includes(search.toLowerCase()) ||
    u.uEmail.toLowerCase().includes(search.toLowerCase()) ||
    u.uMobile.includes(search)
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (uid: number) => {
    console.log("Edit user:", uid);
  };

  const handleDelete = (uid: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Delete user:", uid);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">👥 Users Management</h2>

      {/* 🔍 Search */}
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
                      <button
                        className="btn edit-btn"
                        onClick={() => handleEdit(user.uid)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(user.uid)}
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

export default Users;