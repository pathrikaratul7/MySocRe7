import React, { useState } from "react";
import { GetAllUser } from "../utils/useUser";

const Users: React.FC = () => {
  const users = GetAllUser();

  // 🔍 Search state
  const [search, setSearch] = useState("");

  // 📄 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // 🔍 Filter logic
  const filteredUsers = users.filter((u) =>
    u.uName.toLowerCase().includes(search.toLowerCase()) ||
    u.uEmail.toLowerCase().includes(search.toLowerCase()) ||
    u.uMobile.includes(search)
  );

  // 📄 Pagination logic
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
    <div>
      <h2>👥 Users List</h2>

      {/* 🔍 Search Box */}
      <input
        type="text"
        placeholder="🔍 Search by name, email, mobile"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset page on search
        }}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "10px",
        }}
      />

      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 📊 Table */}
          <table
            border={1}
            cellPadding={10}
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead style={{ backgroundColor: "#f2f2f2" }}>
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
                  <td>{user.privList}</td>

                  <td>
                    <button onClick={() => handleEdit(user.uid)}>
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.uid)}
                      style={{ marginLeft: "10px", color: "red" }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Pagination Controls */}
          <div style={{ marginTop: "10px" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ⬅ Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
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