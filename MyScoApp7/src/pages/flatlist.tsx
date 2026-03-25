import { useState } from "react";
import { GetAllFlatList } from "../utils/flatlistutil";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
const Flatlist: React.FC = () => {
  const navigate = useNavigate();
  const flist = GetAllFlatList("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = flist.filter((u) =>
    u.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    u.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
    u.floorNumber.includes(search)
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (fid: number | string) => {
    Swal.fire({
  title: "Edit Flat Entry ✏️",
  text: "Do you want to modify this Flat details?",
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
    navigate(`/flat-edit/${fid}`);
  }
});
  };

  const handleDelete = (fid : number | string) => {
    Swal.fire({
  title: "Delete Flat Entry 🗑️",
  text: "Do you want to delete this Flat details?",
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
    navigate(`/flat-edit/${fid}`);
  }
});
  };


  return (
    <div className="users-container">
      <h2 className="users-title">👥 Flat Management</h2>

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

      {flist.length === 0 ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {/* Table */}
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>FID</th>
                  <th>FName</th>
                  <th>Floor Number</th>
                  <th>Flat Number</th>
                  <th>Flat Type</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((flist) => (
                  <tr key={flist.fid}>
                    <td>{flist.fid}</td>
                    <td>{flist.ownerName}</td>
                    <td>{flist.floorNumber}</td>
                    <td>{flist.flatNumber}</td>
                    <td>{flist.flatType}</td>
                    <td>
                         <button
                      className="btn edit-btn"
                      onClick={() => handleEdit(flist.fid)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                      <button
                        className="btn delete-btn"
                        onClick={() => handleDelete(flist.fid)} title="Delete"
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


export default Flatlist;