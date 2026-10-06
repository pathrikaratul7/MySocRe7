import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddFlatAPI,
  GetAllFlatAPI,
  GetFlatOwnerOptionsAPI,
  UpdateFlatAPI,
  type FlatOwnerOption,
  type FlatRequest,
  type FlatResponse,
} from "../api/authApi";
import { useCanManageUsers } from "../utils/useUser";
import "../styles/flatForm.css";

interface FlatFormValues {
  ownerName: string;
  floorNumber: string;
  flatNumber: string;
  flatType: string;
}

const emptyForm: FlatFormValues = {
  ownerName: "",
  floorNumber: "",
  flatNumber: "",
  flatType: "",
};

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = error.response;
    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data;
      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }
    }
  }

  return error instanceof Error ? error.message : "Unable to save flat details.";
};

const FlatEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canManageUsers = useCanManageUsers();
  const [flat, setFlat] = useState<FlatResponse | null>(null);
  const [values, setValues] = useState<FlatFormValues>(emptyForm);
  const [owners, setOwners] = useState<FlatOwnerOption[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FlatOwnerOption | null>(null);
  const [showOwnerSuggestions, setShowOwnerSuggestions] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [ownerLoadError, setOwnerLoadError] = useState("");
  const [loadingFlat, setLoadingFlat] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isCreate = !id;
  const needsOwnerLookup = isCreate || !Number(flat?.loginID);

  useEffect(() => {
    let active = true;
    const loadOwners = async () => {
      try {
        setLoadingOwners(true);
        setOwnerLoadError("");
        const users = await GetFlatOwnerOptionsAPI(
          localStorage.getItem("token") || ""
        );
        if (active) {
          setOwners(users.filter((user) => !user.isDeleted));
        }
      } catch (loadError: unknown) {
        console.error("Load flat owner options error:", loadError);
        if (active) {
          setOwnerLoadError(getErrorMessage(loadError));
        }
      } finally {
        if (active) setLoadingOwners(false);
      }
    };

    void loadOwners();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setFlat(null);
      setValues(emptyForm);
      setLoadingFlat(false);
      return;
    }

    let active = true;
    const loadFlat = async () => {
      try {
        setLoadingFlat(true);
        const data = await GetAllFlatAPI(
          localStorage.getItem("token") || "",
          localStorage.getItem("uid") || ""
        );
        const match = Array.isArray(data)
          ? data.find((item: FlatResponse) => String(item.fid) === id)
          : undefined;

        if (!active) return;
        if (!match) {
          setError("Flat details could not be found.");
          return;
        }

        setFlat(match);
        setValues({
          ownerName: match.ownerName,
          floorNumber: match.floorNumber,
          flatNumber: match.flatNumber,
          flatType: match.flatType,
        });
      } catch (loadError: unknown) {
        if (active) {
          console.error("Load flat error:", loadError);
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (active) setLoadingFlat(false);
      }
    };

    void loadFlat();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isCreate && !canManageUsers) {
      setError("Only Admin, SuperAdmin, and Developer can add flats.");
      return;
    }
    const ownerName = values.ownerName.trim();
    const floorNumber = values.floorNumber.trim();
    const flatNumber = values.flatNumber.trim();
    const flatType = values.flatType.trim();
    if (!ownerName || !floorNumber || !flatNumber || !flatType) {
      setError("Please complete all flat details.");
      return;
    }
    if (needsOwnerLookup && !selectedOwner) {
      setError("Search for and select an owner from the suggestions.");
      return;
    }

    const now = new Date().toISOString();
    const actor =
      localStorage.getItem("uName") ||
      localStorage.getItem("uEmail") ||
      "string";
    const uid = Number(localStorage.getItem("uid") || 0);
    const loginID = Number(flat?.loginID || selectedOwner?.uid || 0);
    if (!Number.isInteger(loginID) || loginID <= 0) {
      setError(
        needsOwnerLookup
          ? "The selected owner has an invalid user ID. Select a valid user and try again."
          : "A valid login ID was not returned for this flat."
      );
      return;
    }
    if (!Number.isInteger(uid) || uid <= 0) {
      setError(
        "The logged-in user ID is missing. Please reload the dashboard and try again."
      );
      return;
    }

    const request: FlatRequest = {
      fid: flat?.fid ?? 0,
      ownerName,
      floorNumber,
      flatNumber,
      flatType,
      isDeleted: false,
      createdBy: flat?.createdBy || actor,
      createdDateTime: flat?.createdDateTime || now,
      updatedBy: isCreate ? "string" : actor,
      updatedDateTime: now,
      loginID,
      uid,
      flag: isCreate ? "IN" : "UP",
    };

    try {
      setSaving(true);
      const saved = isCreate
        ? await AddFlatAPI(request)
        : await UpdateFlatAPI(request);

      if (!isCreate) {
        if (
          !saved ||
          Number(saved.fid) !== request.fid ||
          saved.ownerName !== request.ownerName ||
          saved.floorNumber !== request.floorNumber ||
          saved.flatNumber !== request.flatNumber ||
          saved.flatType !== request.flatType
        ) {
          throw new Error(
            "The update endpoint did not confirm the requested flat details."
          );
        }
      }

      await Swal.fire({
        title: isCreate ? "Flat added" : "Flat updated",
        text: isCreate
          ? "The new flat was added successfully."
          : "Flat details were updated successfully.",
        icon: "success",
      });
      navigate("/Flatlist");
    } catch (saveError: unknown) {
      console.error("Save flat error:", saveError);
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  if (loadingFlat) {
    return <div className="flat-form-page"><p>Loading flat details...</p></div>;
  }

  if (!isCreate && !flat) {
    return (
      <div className="flat-form-page">
        <p className="flat-form-error">{error || "Flat details could not be found."}</p>
        <button type="button" className="flat-form-secondary" onClick={() => navigate("/Flatlist")}>
          Back to flats
        </button>
      </div>
    );
  }

  return (
    <div className="flat-form-page">
      <form className="flat-form-card" onSubmit={handleSubmit}>
        <h2>{isCreate ? "Add New Flat" : "Update Flat"}</h2>
        <p className="flat-form-intro">
          {isCreate ? "Enter the new flat information." : "Update the flat information below."}
        </p>

        {error && <div className="flat-form-error" role="alert">{error}</div>}

        {needsOwnerLookup ? (
        <div className="flat-owner-autocomplete">
          <label htmlFor="flat-owner-search">Owner</label>
          <input
            id="flat-owner-search"
            value={values.ownerName}
            onFocus={() => setShowOwnerSuggestions(true)}
            onChange={(event) => {
              setValues({ ...values, ownerName: event.target.value });
              setSelectedOwner(null);
              setShowOwnerSuggestions(true);
            }}
            autoComplete="off"
            placeholder="Search by owner name, email, or mobile"
            aria-autocomplete="list"
            aria-expanded={showOwnerSuggestions}
            aria-controls="flat-owner-suggestions"
            required
          />
          {showOwnerSuggestions && (
            <div
              id="flat-owner-suggestions"
              className="flat-owner-suggestions"
              role="listbox"
            >
              {loadingOwners ? (
                <div className="flat-owner-state">Loading users...</div>
              ) : ownerLoadError ? (
                <div className="flat-owner-state flat-owner-state-error" role="alert">
                  {ownerLoadError}
                </div>
              ) : (
                (() => {
                  const query = values.ownerName.trim().toLowerCase();
                  const matches = owners
                    .filter((owner) =>
                      [owner.uName, owner.uEmail || "", owner.uMobile || ""]
                        .some((value) => value.toLowerCase().includes(query))
                    )
                    .slice(0, 8);

                  if (matches.length === 0) {
                    return (
                      <div className="flat-owner-state">
                        {query ? "No matching users." : "Start typing to search users."}
                      </div>
                    );
                  }

                  return matches.map((owner) => (
                    <button
                      key={owner.uid}
                      type="button"
                      className="flat-owner-option"
                      role="option"
                      aria-selected={selectedOwner?.uid === owner.uid}
                      onClick={() => {
                        setSelectedOwner(owner);
                        setValues({ ...values, ownerName: owner.uName });
                        setShowOwnerSuggestions(false);
                      }}
                    >
                      <span>{owner.uName || "Unnamed user"}</span>
                      <small>
                        {[owner.uEmail, owner.uMobile, `UID ${owner.uid}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </small>
                    </button>
                  ));
                })()
              )}
            </div>
          )}
          {selectedOwner && (
            <p className="flat-owner-selected">
              Selected user UID: {selectedOwner.uid}
              {selectedOwner.userType ? ` · ${selectedOwner.userType}` : ""}
            </p>
          )}
        </div>
        ) : (
          <label>
            Owner name
            <input
              value={values.ownerName}
              onChange={(event) =>
                setValues({ ...values, ownerName: event.target.value })
              }
              required
            />
          </label>
        )}

        <label>
          Login ID
          <input
            value={isCreate ? selectedOwner?.uid ?? "" : flat?.loginID ?? ""}
            readOnly
          />
        </label>

        <div className="flat-form-row">
          <label>
            Floor number
            <input
              value={values.floorNumber}
              onChange={(event) => setValues({ ...values, floorNumber: event.target.value })}
              required
            />
          </label>
          <label>
            Flat number
            <input
              value={values.flatNumber}
              onChange={(event) => setValues({ ...values, flatNumber: event.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Flat type
          <input
            value={values.flatType}
            onChange={(event) => setValues({ ...values, flatType: event.target.value })}
            placeholder="e.g. 1BHK"
            required
          />
        </label>

        <div className="flat-form-actions">
          <button
            type="button"
            className="flat-form-secondary"
            onClick={() => navigate("/Flatlist")}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flat-form-primary"
            disabled={saving || (isCreate && !canManageUsers)}
          >
            {saving ? "Saving..." : isCreate ? "Add flat" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlatEdit;
