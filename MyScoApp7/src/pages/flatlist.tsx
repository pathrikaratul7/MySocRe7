import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import { GetAllFlatAPI, UpdateFlatAPI, type FlatRequest, type FlatResponse } from "../api/authApi";
import "../styles/flatForm.css";
const Flatlist: React.FC = () => {
  const navigate = useNavigate();
  const [flist, setFlist] = useState<FlatResponse[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    let active = true;
    const loadFlats = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const data = await GetAllFlatAPI(
          localStorage.getItem("token") || "",
          localStorage.getItem("uid") || ""
        );
        if (active) {
          setFlist(
            Array.isArray(data)
              ? data.filter((flat: FlatResponse) => flat.isDeleted !== true)
              : []
          );
        }
      } catch (error: unknown) {
        console.error("Load flats error:", error);
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load flats."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadFlats();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const filteredUsers = flist.filter((u) =>
    u.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    u.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
    u.floorNumber.includes(search)
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    setCurrentPage((page) => Math.max(1, Math.min(page, totalPages || 1)));
  }, [totalPages]);

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

  const handleDelete = async (flat: (typeof flist)[number]) => {
    const result = await Swal.fire({
      title: "Delete Flat Entry",
      text: `Delete flat ${flat.flatNumber}?`,
      icon: "warning",
      background: "#1e1e2f",
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const now = new Date().toISOString();
    const actor =
      localStorage.getItem("uName") ||
      localStorage.getItem("uEmail") ||
      "string";
    const request: FlatRequest = {
      fid: Number(flat.fid),
      ownerName: flat.ownerName,
      floorNumber: flat.floorNumber,
      flatNumber: flat.flatNumber,
      flatType: flat.flatType,
      isDeleted: true,
      createdBy: flat.createdBy || actor,
      createdDateTime: flat.createdDateTime || now,
      updatedBy: actor,
      updatedDateTime: now,
      loginID: Number(flat.loginID || localStorage.getItem("loginID") || 0),
      uid: Number(flat.uid || localStorage.getItem("uid") || 0),
      flag: "UP",
    };

    try {
      await UpdateFlatAPI(request);
      setRefreshKey((key) => key + 1);
      await Swal.fire({
        title: "Flat deleted",
        text: "The flat was removed successfully.",
        icon: "success",
      });
    } catch (deleteError: unknown) {
      console.error("Delete flat error:", deleteError);
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this flat.";
      await Swal.fire({
        title: "Delete failed",
        text: message,
        icon: "error",
      });
    }
  };


  return (
    <div className="users-container">
      <div className="flat-list-heading">
        <h2 className="users-title">Flat Management</h2>
        <button
          type="button"
          className="flat-form-primary flat-add-button"
          onClick={() => navigate("/flat-add")}
        >
          + Add New Flat
        </button>
      </div>

      
      <input
        type="text"
        placeholder="Search flats..."
        className="search-box"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <p className="loading">Loading...</p>
      ) : loadError ? (
        <p className="flat-form-error" role="alert">{loadError}</p>
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
                        onClick={() => void handleDelete(flist)} title="Delete"
                      >
                        <FaDeleteLeft/>
                      </button>
                    </td>
                  </tr>
                ))}

                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="no-data">
                      No flats found
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
              Page {currentPage} / {Math.max(1, totalPages)}
            </span>

            <button
              disabled={totalPages === 0 || currentPage === totalPages}
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