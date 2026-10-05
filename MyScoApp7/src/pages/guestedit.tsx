import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddGuestAPI,
  GetAllGuestListAPI,
  PreGetAllFlatAPI,
  UploadGuestImageAPI,
  UpdateGuestAPI,
  type GuestRecord,
  type GuestRequest,
  type PreFlat,
} from "../api/authApi";
import { useUser } from "../utils/useUser";
import "../styles/UserEdit.css";
import "../styles/PreGuest.css";

interface GuestFormValues {
  gName: string;
  gMobile: string;
  gEmail: string;
  inDateTime: string;
  outDateTime: string;
  status: string;
  flatOwnerMobile: string;
}

const STATUS_OPTIONS = ["PENDING", "APPROVE", "REJECT"];

const localDateTimeValue = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const apiDateTimeValue = (value: string): string =>
  value ? new Date(value).toISOString() : "";

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
  return error instanceof Error ? error.message : "Unable to save guest details.";
};

const GuestEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useUser();
  const isCreate = !id;
  const [guest, setGuest] = useState<GuestRecord | null>(null);
  const [flats, setFlats] = useState<PreFlat[]>([]);
  const [selectedFlat, setSelectedFlat] = useState<PreFlat | null>(null);
  const [flatSearchText, setFlatSearchText] = useState("");
  const [showFlatSuggestions, setShowFlatSuggestions] = useState(false);
  const [values, setValues] = useState<GuestFormValues>({
    gName: "",
    gMobile: "",
    gEmail: "",
    inDateTime: localDateTimeValue(new Date().toISOString()),
    outDateTime: "",
    status: "PENDING",
    flatOwnerMobile: "",
  });
  const [guestImage, setGuestImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const flatAutocompleteRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadingFlats, setLoadingFlats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadFlats = async () => {
      try {
        setLoadingFlats(true);
        const data = await PreGetAllFlatAPI();
        if (active) {
          setFlats(
            Array.isArray(data)
              ? data.filter((flat) => flat.isDeleted !== true)
              : []
          );
        }
      } catch (loadError: unknown) {
        console.error("Load guest flat options error:", loadError);
        if (active) setError(getErrorMessage(loadError));
      } finally {
        if (active) setLoadingFlats(false);
      }
    };

    void loadFlats();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let active = true;
    const loadGuest = async () => {
      try {
        setLoading(true);
        const records = await GetAllGuestListAPI(
          localStorage.getItem("token") || "",
          localStorage.getItem("uid") ||
            ""
        );
        const match = records.find((item) => String(item.gid) === id);

        if (!active) return;
        if (!match) {
          setError("Guest details could not be found.");
          return;
        }

        setGuest(match);
        setValues({
          gName: match.gName || "",
          gMobile: match.gMobile || "",
          gEmail: match.gEmail || "",
          inDateTime: localDateTimeValue(match.inDateTime),
          outDateTime: localDateTimeValue(match.outDateTime),
          status: match.status || "PENDING",
          flatOwnerMobile: match.flatOwnerMobile || "",
        });
        setFlatSearchText(match.flatNumber || "");
        setPreviewImage(match.gImagePath || "");
      } catch (loadError: unknown) {
        console.error("Load guest error:", loadError);
        if (active) setError(getErrorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadGuest();
    return () => {
      active = false;
    };
  }, [id]);

  const getFlatOwnerMobile = (flat: PreFlat): string => {
    if (flat.ownerMobile) return flat.ownerMobile;
    if (flat.mobile) return flat.mobile;
    if (flat.flatOwnerMobile) return flat.flatOwnerMobile;
    const matches = flat.ownerName?.match(/\d{10}/g);
    return matches?.at(-1) || "";
  };

  const getFlatOwnerEmail = (flat: PreFlat): string =>
    flat.email || flat.ownerEmail || "";

  const filteredFlatSuggestions = useMemo(() => {
    const search = flatSearchText.trim().toLowerCase();
    if (!search) return [];

    return flats
      .filter((flat) =>
        [
          flat.flatNumber,
          flat.ownerName,
          getFlatOwnerEmail(flat),
          getFlatOwnerMobile(flat),
          flat.floorNumber,
          flat.flatType,
        ].some((value) => value?.toLowerCase().includes(search))
      )
      .slice(0, 10);
  }, [flatSearchText, flats]);

  useEffect(() => {
    if (!guest || flats.length === 0) return;
    const match = flats.find(
      (flat) => String(flat.fid) === String(guest.fid)
    );
    if (!match) return;

    setSelectedFlat(match);
    setFlatSearchText(match.flatNumber || "");
    setValues((current) => ({
      ...current,
      flatOwnerMobile:
        current.flatOwnerMobile || getFlatOwnerMobile(match),
    }));
  }, [guest, flats]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flatAutocompleteRef.current &&
        !flatAutocompleteRef.current.contains(event.target as Node)
      ) {
        setShowFlatSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleFlatSearchChange = (value: string) => {
    setFlatSearchText(value);
    if (selectedFlat) {
      setSelectedFlat(null);
      setValues((current) => ({ ...current, flatOwnerMobile: "" }));
    }
    setShowFlatSuggestions(value.trim().length > 0);
  };

  const handleFlatSelect = (flat: PreFlat) => {
    setSelectedFlat(flat);
    setFlatSearchText(flat.flatNumber || "");
    setValues((current) => ({
      ...current,
      flatOwnerMobile: getFlatOwnerMobile(flat),
    }));
    setShowFlatSuggestions(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid guest image.");
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setGuestImage(file);
    setPreviewImage(nextPreview);
    setError("");
  };

  const getImageSource = (path: string): string => {
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    return `https://mysoc7.runasp.net${path.startsWith("/") ? path : `/${path}`}`;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!values.gName.trim() || !values.gMobile.trim()) {
      setError("Guest name and mobile are required.");
      return;
    }
    if (!selectedFlat) {
      setError("Search for and select a flat from the autocomplete list.");
      return;
    }
    if (!values.inDateTime) {
      setError("Please provide the guest's arrival date and time.");
      return;
    }
    if (isCreate && !guestImage) {
      setError("Please capture or select a guest image.");
      return;
    }

    const now = new Date().toISOString();
    const actor =
      currentUser?.uName ||
      localStorage.getItem("uName") ||
      localStorage.getItem("uEmail") ||
      "string";
    const request: GuestRequest = {
      gid: Number(guest?.gid || 0),
      gName: values.gName.trim(),
      gMobile: values.gMobile.trim(),
      gEmail: values.gEmail.trim(),
      inDateTime: apiDateTimeValue(values.inDateTime),
      outDateTime: values.outDateTime
        ? apiDateTimeValue(values.outDateTime)
        : null,
      fid: Number(selectedFlat.fid),
      status: values.status,
      isDeleted: guest?.isDeleted ?? false,
      createdBy: guest?.createdBy || actor,
      createdDateTime: guest?.createdDateTime || now,
      updatedBy: isCreate ? null : actor,
      updatedDateTime: isCreate ? null : now,
      floorNumber: selectedFlat.floorNumber || "",
      flatNumber: selectedFlat.flatNumber || "",
      flatType: selectedFlat.flatType || "",
      gImagePath: guest?.gImagePath || "string",
      flatOwnerMobile: values.flatOwnerMobile.trim(),
      creatorMobile: currentUser?.uMobile || "",
      loginID: Number(
        guest?.loginID ||
          localStorage.getItem("uid") ||
          currentUser?.uid ||
          currentUser?.loginID ||
          0
      ),
      flag: isCreate ? "IN" : "UP",
    };

    try {
      setSaving(true);
      const guestImagePath = guestImage
        ? await UploadGuestImageAPI(guestImage)
        : guest?.gImagePath || "string";
      const result = isCreate
        ? await AddGuestAPI({ ...request, gImagePath: guestImagePath })
        : await UpdateGuestAPI({ ...request, gImagePath: guestImagePath });

      if (isCreate && (!result || !result.gid)) {
        throw new Error("The server did not confirm adding this guest.");
      }
      if (!isCreate && result && String(result.gid) !== String(request.gid)) {
        throw new Error("The server response did not confirm this guest update.");
      }

      await Swal.fire({
        title: isCreate ? "Guest added" : "Guest updated",
        text: isCreate
          ? "Guest details were added successfully."
          : "Guest details were updated successfully.",
        icon: "success",
      });
      navigate("/guestlist");
    } catch (saveError: unknown) {
      console.error("Save guest error:", saveError);
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingFlats) {
    return (
      <div className="user-edit-container">
        <p className="loading">Loading guest details...</p>
      </div>
    );
  }

  if (!isCreate && !guest) {
    return (
      <div className="user-edit-container">
        <div className="user-form-card">
          <p className="user-form-error" role="alert">
            {error || "Guest details could not be found."}
          </p>
          <button
            type="button"
            className="user-form-secondary"
            onClick={() => navigate("/guestlist")}
          >
            Back to guests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-edit-container">
      <form className="user-form-card" onSubmit={handleSubmit}>
        <h2 className="title">{isCreate ? "Add Guest" : "Update Guest"}</h2>
        <p className="user-form-intro">
          Enter guest contact and visit details.
        </p>
        {error && (
          <p className="user-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="user-form-grid">
          <label>
            Guest name
            <input
              value={values.gName}
              onChange={(event) =>
                setValues({ ...values, gName: event.target.value })
              }
              autoComplete="name"
              required
            />
          </label>
          <label>
            Mobile
            <input
              type="tel"
              value={values.gMobile}
              onChange={(event) =>
                setValues({ ...values, gMobile: event.target.value })
              }
              autoComplete="tel"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={values.gEmail}
              onChange={(event) =>
                setValues({ ...values, gEmail: event.target.value })
              }
              autoComplete="email"
            />
          </label>
          <div
            className="pre-guest-field pre-guest-autocomplete"
            ref={flatAutocompleteRef}
          >
            <label htmlFor="guest-flat-search">Flat *</label>
            <input
              id="guest-flat-search"
              type="text"
              value={flatSearchText}
              onChange={(event) =>
                handleFlatSearchChange(event.target.value)
              }
              onFocus={() => {
                if (flatSearchText.trim()) setShowFlatSuggestions(true);
              }}
              placeholder="Search flat, owner, email or mobile"
              disabled={saving}
              className="pre-guest-input"
              autoComplete="off"
              required={!selectedFlat}
            />
            {showFlatSuggestions && flatSearchText.trim() &&
              filteredFlatSuggestions.length > 0 && (
                <div className="pre-guest-suggestions">
                  {filteredFlatSuggestions.map((flat) => {
                    const ownerMobile = getFlatOwnerMobile(flat);
                    const ownerEmail = getFlatOwnerEmail(flat);
                    return (
                      <div
                        key={flat.fid}
                        className="pre-guest-suggestion-item"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleFlatSelect(flat);
                        }}
                      >
                        <div className="pre-guest-suggestion-main">
                          {flat.ownerName || "Flat owner"}
                        </div>
                        <div className="pre-guest-suggestion-details">
                          <span>Flat: {flat.flatNumber}</span>
                          <span>Floor: {flat.floorNumber}</span>
                          <span>{flat.flatType}</span>
                        </div>
                        {(ownerMobile || ownerEmail) && (
                          <div className="pre-guest-suggestion-details">
                            {ownerMobile && <span>{ownerMobile}</span>}
                            {ownerEmail && <span>{ownerEmail}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            {showFlatSuggestions && flatSearchText.trim() &&
              filteredFlatSuggestions.length === 0 && (
                <div className="pre-guest-no-suggestions">
                  No matching flat found.
                </div>
              )}
          </div>
          <label>
            Flat owner mobile
            <input
              type="tel"
              value={values.flatOwnerMobile}
              onChange={(event) =>
                setValues({ ...values, flatOwnerMobile: event.target.value })
              }
              disabled={Boolean(selectedFlat) || saving}
            />
          </label>
          <label>
            Status
            <select
              value={values.status}
              onChange={(event) =>
                setValues({ ...values, status: event.target.value })
              }
            >
              {!STATUS_OPTIONS.includes(values.status) && (
                <option value={values.status}>{values.status}</option>
              )}
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Visit from
            <input
              type="datetime-local"
              value={values.inDateTime}
              onChange={(event) =>
                setValues({ ...values, inDateTime: event.target.value })
              }
              required
            />
          </label>
          <label>
            Visit until
            <input
              type="datetime-local"
              value={values.outDateTime}
              onChange={(event) =>
                setValues({ ...values, outDateTime: event.target.value })
              }
            />
          </label>
        </div>

        {selectedFlat && (
          <div className="pre-guest-selected-flat">
            <div className="pre-guest-selected-flat-title">Flat selected</div>
            <div className="pre-guest-selected-flat-details">
              <div><span>Owner</span><strong>{selectedFlat.ownerName}</strong></div>
              <div><span>Flat</span><strong>{selectedFlat.flatNumber}</strong></div>
              <div><span>Floor</span><strong>{selectedFlat.floorNumber}</strong></div>
              <div><span>Type</span><strong>{selectedFlat.flatType}</strong></div>
            </div>
          </div>
        )}

        <section className="pre-guest-section guest-image-section">
          <h2>Guest Photo{isCreate ? " *" : ""}</h2>
          <div className="pre-guest-image-container">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              disabled={saving}
              className="pre-guest-input"
              aria-label="Capture or select guest photo"
            />
            {previewImage && (
              <div className="pre-guest-image-preview">
                <img
                  src={getImageSource(previewImage)}
                  alt="Guest preview"
                />
              </div>
            )}
            {!previewImage && !isCreate && (
              <p className="user-image-help">No guest image uploaded.</p>
            )}
          </div>
        </section>

        <div className="user-form-actions">
          <button
            type="button"
            className="user-form-secondary"
            onClick={() => navigate("/guestlist")}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="user-form-primary"
            disabled={saving}
          >
            {saving
              ? guestImage
                ? "Uploading image and saving..."
                : "Saving..."
              : isCreate
                ? "Add guest"
                : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestEdit;
