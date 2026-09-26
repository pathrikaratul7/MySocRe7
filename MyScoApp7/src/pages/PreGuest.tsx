import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type PreFlat,
  PreGuestAddAPI,
  type PreGuestRequest,
  PreGetAllFlatAPI,
  UploadGuestImageAPI,
} from "../api/authApi";

import "../styles/PreGuest.css";

const PreGuest: React.FC = () => {
  /* =========================================================
     GUEST DETAILS
  ========================================================= */

  const [gName, setGName] = useState("");
  const [gMobile, setGMobile] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [inDateTime, setInDateTime] = useState("");
  const [outDateTime, setOutDateTime] = useState("");

  /* =========================================================
     FLAT DETAILS
  ========================================================= */

  const [fid, setFid] = useState(0);
  const [floorNumber, setFloorNumber] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [flatType, setFlatType] = useState("");
  const [flatOwnerMobile, setFlatOwnerMobile] = useState("");
  const [creatorMobile, setCreatorMobile] = useState("");

  /* =========================================================
     PRE FLAT AUTOCOMPLETE
  ========================================================= */

  const [preFlatData, setPreFlatData] = useState<PreFlat[]>([]);
  const [flatSearchText, setFlatSearchText] = useState("");
  const [showFlatSuggestions, setShowFlatSuggestions] =
    useState(false);
  const [selectedFlat, setSelectedFlat] =
    useState<PreFlat | null>(null);
  const [loadingPreFlat, setLoadingPreFlat] =
    useState(false);

  /* =========================================================
     IMAGE
  ========================================================= */

  const [guestImage, setGuestImage] =
    useState<File | null>(null);

  const [previewImage, setPreviewImage] =
    useState<string | null>(null);

  /* =========================================================
     REGISTER STATE
  ========================================================= */

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] =
    useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registeredGuestId, setRegisteredGuestId] =
    useState<number | null>(null);

  /* =========================================================
     REF
  ========================================================= */

  const flatAutocompleteRef =
    useRef<HTMLDivElement | null>(null);

  /* =========================================================
     ERROR MESSAGE HELPER
  ========================================================= */

  const getErrorMessage = (
    err: unknown,
    defaultMessage: string
  ): string => {
    if (err instanceof Error) {
      return err.message;
    }

    if (
      typeof err === "object" &&
      err !== null
    ) {
      const errorObject = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      return (
        errorObject.response?.data?.message ||
        errorObject.message ||
        defaultMessage
      );
    }

    return defaultMessage;
  };

  /* =========================================================
     LOAD PRE FLAT DATA
     JWT TOKEN IS NOT REQUIRED
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadPreFlatData = async () => {
      try {
        setLoadingPreFlat(true);
        setError("");

        const data = await PreGetAllFlatAPI();

        if (!isMounted) {
          return;
        }

        const activeFlats = Array.isArray(data)
          ? data.filter(
              (flat) => flat.isDeleted !== true
            )
          : [];

        setPreFlatData(activeFlats);
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }

        console.error(
          "PreGetAllFlatAPI Error:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "Unable to load flat details."
          )
        );
      } finally {
        if (isMounted) {
          setLoadingPreFlat(false);
        }
      }
    };

    loadPreFlatData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     EXTRACT MOBILE FROM OWNER NAME

     Example:
     Atul Pathrikar-51-9673178777

     Result:
     9673178777
  ========================================================= */

  const extractMobileFromOwnerName = (
    ownerName: string
  ): string => {
    if (!ownerName) {
      return "";
    }

    const matches =
      ownerName.match(/\d{10}/g);

    if (!matches || matches.length === 0) {
      return "";
    }

    return matches[matches.length - 1];
  };

  /* =========================================================
     GET FLAT OWNER MOBILE
  ========================================================= */

  const getFlatOwnerMobile = (
    flat: PreFlat
  ): string => {
    if (flat.ownerMobile) {
      return flat.ownerMobile;
    }

    if (flat.mobile) {
      return flat.mobile;
    }

    if (flat.flatOwnerMobile) {
      return flat.flatOwnerMobile;
    }

    return extractMobileFromOwnerName(
      flat.ownerName
    );
  };

  /* =========================================================
     GET FLAT OWNER EMAIL

     Current API response doesn't contain email,
     but this supports email if API returns it.
  ========================================================= */

  const getFlatOwnerEmail = (
    flat: PreFlat
  ): string => {
    return (
      flat.email ||
      flat.ownerEmail ||
      ""
    );
  };

  /* =========================================================
     AUTOCOMPLETE SEARCH
  ========================================================= */

  const filteredFlatSuggestions =
    useMemo(() => {
      const search =
        flatSearchText
          .trim()
          .toLowerCase();

      if (!search) {
        return [];
      }

      return preFlatData
        .filter((flat) => {
          const ownerName =
            flat.ownerName?.toLowerCase() ||
            "";

          const flatNumber =
            flat.flatNumber?.toLowerCase() ||
            "";

          const floorNumber =
            flat.floorNumber?.toLowerCase() ||
            "";

          const flatType =
            flat.flatType?.toLowerCase() ||
            "";

          const email =
            getFlatOwnerEmail(flat).toLowerCase();

          const mobile =
            getFlatOwnerMobile(flat).toLowerCase();

          return (
            flatNumber.includes(search) ||
            ownerName.includes(search) ||
            email.includes(search) ||
            mobile.includes(search) ||
            floorNumber.includes(search) ||
            flatType.includes(search)
          );
        })
        .slice(0, 10);
    }, [
      flatSearchText,
      preFlatData,
    ]);

  /* =========================================================
     FLAT SEARCH CHANGE
  ========================================================= */

  const handleFlatSearchChange = (
    value: string
  ) => {
    setFlatSearchText(value);

    /*
     * If user changes search after selecting
     * a flat, remove previous selection.
     */

    if (selectedFlat) {
      setSelectedFlat(null);
      setFid(0);
      setFloorNumber("");
      setFlatNumber("");
      setFlatType("");
      setFlatOwnerMobile("");
    }

    setShowFlatSuggestions(
      value.trim().length > 0
    );
  };

  /* =========================================================
     SELECT FLAT
  ========================================================= */

  const handleFlatSelect = (
    flat: PreFlat
  ) => {
    const ownerMobile =
      getFlatOwnerMobile(flat);

    setSelectedFlat(flat);

    setFid(flat.fid);

    setFlatNumber(
      flat.flatNumber || ""
    );

    setFloorNumber(
      flat.floorNumber || ""
    );

    setFlatType(
      flat.flatType || ""
    );

    setFlatOwnerMobile(
      ownerMobile
    );

    setFlatSearchText(
      flat.flatNumber || ""
    );

    setShowFlatSuggestions(false);
  };

  /* =========================================================
     CLOSE AUTOCOMPLETE OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        flatAutocompleteRef.current &&
        !flatAutocompleteRef.current.contains(
          event.target as Node
        )
      ) {
        setShowFlatSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     IMAGE SELECT
  ========================================================= */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setGuestImage(file);

    setPreviewImage(
      URL.createObjectURL(file)
    );

    setError("");
  };

  /* =========================================================
     DATE TO ISO
  ========================================================= */

  const convertToISO = (
    value: string
  ): string => {
    if (!value) {
      return new Date().toISOString();
    }

    return new Date(value).toISOString();
  };

  /* =========================================================
     VALIDATE MOBILE
  ========================================================= */

  const isValidMobile = (
    mobile: string
  ): boolean => {
    return /^[6-9]\d{9}$/.test(
      mobile.trim()
    );
  };

  /* =========================================================
     VALIDATE EMAIL
  ========================================================= */

  const isValidEmail = (
    email: string
  ): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    );
  };

  /* =========================================================
     CLEAR FORM
  ========================================================= */

  const clearFormFields = () => {
    setGName("");
    setGMobile("");
    setGEmail("");
    setInDateTime("");
    setOutDateTime("");

    setFid(0);
    setFloorNumber("");
    setFlatNumber("");
    setFlatType("");
    setFlatOwnerMobile("");
    setCreatorMobile("");

    setFlatSearchText("");
    setSelectedFlat(null);
    setShowFlatSuggestions(false);

    setGuestImage(null);
    setPreviewImage(null);

    setError("");
    setSuccess("");
    setRegisteredGuestId(null);
    setLoadingMessage("");
  };

  /* =========================================================
     REGISTER PRE GUEST
  ========================================================= */

  const handleRegister = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setRegisteredGuestId(null);

    /* =========================================
       GUEST NAME
    ========================================= */

    if (!gName.trim()) {
      setError(
        "👤 Please enter guest name."
      );
      return;
    }

    /* =========================================
       GUEST MOBILE
    ========================================= */

    if (!isValidMobile(gMobile)) {
      setError(
        "📱 Please enter a valid 10 digit guest mobile number."
      );
      return;
    }

    /* =========================================
       EMAIL
    ========================================= */

    if (
      gEmail.trim() &&
      !isValidEmail(gEmail)
    ) {
      setError(
        "📧 Please enter a valid email address."
      );
      return;
    }

    /* =========================================
       IN DATE
    ========================================= */

    if (!inDateTime) {
      setError(
        "📅 Please select entry date and time."
      );
      return;
    }

    /* =========================================
       FLAT
    ========================================= */

    if (
      !selectedFlat ||
      !fid
    ) {
      setError(
        "🏠 Please search and select a flat from the autocomplete list."
      );
      return;
    }

    /* =========================================
       FLOOR
    ========================================= */

    if (!floorNumber.trim()) {
      setError(
        "🏢 Floor number is required."
      );
      return;
    }

    /* =========================================
       FLAT NUMBER
    ========================================= */

    if (!flatNumber.trim()) {
      setError(
        "🏠 Flat number is required."
      );
      return;
    }

    /* =========================================
       FLAT OWNER MOBILE
    ========================================= */

    if (
      !isValidMobile(flatOwnerMobile)
    ) {
      setError(
        "📱 Flat owner mobile number is invalid."
      );
      return;
    }

    /* =========================================
       CREATOR MOBILE - OPTIONAL
       
       Empty = valid
       Entered = must be valid 10 digit number
    ========================================= */

    if (
      creatorMobile.trim() &&
      !isValidMobile(creatorMobile)
    ) {
      setError(
        "📱 Please enter a valid 10 digit creator mobile number."
      );
      return;
    }

    /* =========================================
       IMAGE
    ========================================= */

    if (!guestImage) {
      setError(
        "📷 Please select guest image."
      );
      return;
    }

    try {
      setLoading(true);

      /* =======================================
         UPLOAD IMAGE
      ======================================= */

      setLoadingMessage(
        "📷 Uploading guest image..."
      );

      const guestImagePath =
        await UploadGuestImageAPI(
          guestImage
        );

      /* =======================================
         PRE GUEST REQUEST
      ======================================= */

      const preGuestData: PreGuestRequest = {
        gid: 0,

        gName:
          gName.trim(),

        gMobile:
          gMobile.trim(),

        gEmail:
          gEmail.trim(),

        inDateTime:
          convertToISO(inDateTime),

        outDateTime:
          outDateTime
            ? convertToISO(outDateTime)
            : null,

        fid:
          selectedFlat.fid,

        status:
          "PENDING",

        isDeleted:
          false,

        createdBy:
          gName.trim(),

        createdDateTime:
          new Date().toISOString(),

        updatedBy:
          null,

        updatedDateTime:
          new Date().toISOString(),

        floorNumber:
          floorNumber.trim(),

        flatNumber:
          flatNumber.trim(),

        flatType:
          flatType.trim(),

        gImagePath:
          guestImagePath,

        flatOwnerMobile:
          flatOwnerMobile.trim(),

        /*
         * Creator Mobile is optional.
         * Empty value will be sent if not entered.
         */
        creatorMobile:
          creatorMobile.trim(),

        loginID:
          0,

        flag:
          "IN",
      };

      /* =======================================
         ADD PRE GUEST
      ======================================= */

      setLoadingMessage(
        "🚪 Registering guest..."
      );

      const result =
        await PreGuestAddAPI(
          preGuestData
        );

      /* =======================================
         SUCCESS
      ======================================= */

      if (result?.gid) {
        setRegisteredGuestId(
          result.gid
        );

        setSuccess(
          `✅ Guest registered successfully. Guest ID: ${result.gid}`
        );

        /* =====================================
           CLEAR FORM
        ===================================== */

        setGName("");
        setGMobile("");
        setGEmail("");
        setInDateTime("");
        setOutDateTime("");

        setFid(0);
        setFloorNumber("");
        setFlatNumber("");
        setFlatType("");
        setFlatOwnerMobile("");
        setCreatorMobile("");

        setFlatSearchText("");
        setSelectedFlat(null);
        setShowFlatSuggestions(false);

        setGuestImage(null);
        setPreviewImage(null);
      } else {
        setError(
          result?.message ||
          "Guest registration failed."
        );
      }
    } catch (err: unknown) {
      console.error(
        "Pre Guest Registration Error:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Something went wrong while registering guest."
        )
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="pre-guest-page">
      <div className="pre-guest-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="pre-guest-header">
          <div>
            <h1>
              🚪 Pre Guest Registration
            </h1>

            <p>
              Register visitor details before
              guest arrival.
            </p>
          </div>

          <div className="pre-guest-flat-count">
            🏠 {preFlatData.length} Flats
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="pre-guest-alert error">
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="pre-guest-alert success">
            {success}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleRegister}
          className="pre-guest-form"
        >

          {/* ===============================================
              GUEST INFORMATION
          =============================================== */}

          <div className="pre-guest-section">
            <h2>
              👤 Guest Information
            </h2>

            <div className="pre-guest-grid">

              {/* Guest Name */}

              <div className="pre-guest-field">
                <label>
                  Guest Name *
                </label>

                <input
                  type="text"
                  value={gName}
                  onChange={(e) =>
                    setGName(
                      e.target.value
                    )
                  }
                  placeholder="Enter guest name"
                  disabled={loading}
                  className="pre-guest-input"
                />
              </div>

              {/* Guest Mobile */}

              <div className="pre-guest-field">
                <label>
                  Guest Mobile *
                </label>

                <input
                  type="tel"
                  value={gMobile}
                  onChange={(e) =>
                    setGMobile(
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(0, 10)
                    )
                  }
                  placeholder="Enter 10 digit mobile"
                  maxLength={10}
                  disabled={loading}
                  className="pre-guest-input"
                />
              </div>

              {/* Guest Email */}

              <div className="pre-guest-field">
                <label>
                  Guest Email
                </label>

                <input
                  type="email"
                  value={gEmail}
                  onChange={(e) =>
                    setGEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter guest email"
                  disabled={loading}
                  className="pre-guest-input"
                />
              </div>

            </div>
          </div>

          {/* ===============================================
              VISIT INFORMATION
          =============================================== */}

          <div className="pre-guest-section">
            <h2>
              📅 Visit Information
            </h2>

            <div className="pre-guest-grid">

              <div className="pre-guest-field">
                <label>
                  In Date & Time *
                </label>

                <input
                  type="datetime-local"
                  value={inDateTime}
                  onChange={(e) =>
                    setInDateTime(
                      e.target.value
                    )
                  }
                  disabled={loading}
                  className="pre-guest-input"
                />
              </div>

              <div className="pre-guest-field">
                <label>
                  Out Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={outDateTime}
                  onChange={(e) =>
                    setOutDateTime(
                      e.target.value
                    )
                  }
                  disabled={loading}
                  className="pre-guest-input"
                />
              </div>

            </div>
          </div>

          {/* ===============================================
              FLAT INFORMATION
          =============================================== */}

          <div className="pre-guest-section">

            <h2>
              🏠 Flat Information
            </h2>

            <div className="pre-guest-grid">

              {/* ===========================================
                  FLAT AUTOCOMPLETE
              =========================================== */}

              <div
                className="pre-guest-field pre-guest-autocomplete"
                ref={flatAutocompleteRef}
              >
                <label>
                  Flat Number *
                </label>

                <input
                  type="text"
                  value={flatSearchText}
                  onChange={(e) =>
                    handleFlatSearchChange(
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (
                      flatSearchText.trim()
                    ) {
                      setShowFlatSuggestions(
                        true
                      );
                    }
                  }}
                  placeholder={
                    loadingPreFlat
                      ? "Loading flats..."
                      : "Search flat, owner, email or mobile"
                  }
                  disabled={
                    loading ||
                    loadingPreFlat
                  }
                  className="pre-guest-input"
                  autoComplete="off"
                />

                {/* Loading */}

                {loadingPreFlat && (
                  <div className="pre-guest-suggestion-loading">
                    ⏳ Loading flat details...
                  </div>
                )}

                {/* Suggestions */}

                {showFlatSuggestions &&
                  !loadingPreFlat &&
                  flatSearchText.trim() &&
                  filteredFlatSuggestions.length > 0 && (
                    <div className="pre-guest-suggestions">

                      {filteredFlatSuggestions.map(
                        (flat) => {
                          const mobile =
                            getFlatOwnerMobile(
                              flat
                            );

                          const email =
                            getFlatOwnerEmail(
                              flat
                            );

                          return (
                            <div
                              key={flat.fid}
                              className="pre-guest-suggestion-item"
                              onMouseDown={(e) => {
                                e.preventDefault();

                                handleFlatSelect(
                                  flat
                                );
                              }}
                            >

                              <div className="pre-guest-suggestion-main">
                                👤{" "}
                                {flat.ownerName}
                              </div>

                              <div className="pre-guest-suggestion-details">

                                <span>
                                  🏠 Flat:{" "}
                                  {flat.flatNumber}
                                </span>

                                <span>
                                  🏢 Floor:{" "}
                                  {flat.floorNumber}
                                </span>

                                <span>
                                  🏷️{" "}
                                  {flat.flatType}
                                </span>

                              </div>

                              <div className="pre-guest-suggestion-details">

                                {mobile && (
                                  <span>
                                    📱 {mobile}
                                  </span>
                                )}

                                {email && (
                                  <span>
                                    📧 {email}
                                  </span>
                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                {/* No Result */}

                {showFlatSuggestions &&
                  !loadingPreFlat &&
                  flatSearchText.trim() &&
                  filteredFlatSuggestions.length === 0 && (
                    <div className="pre-guest-no-suggestions">
                      🔍 No matching flat found.
                    </div>
                  )}

              </div>

              {/* ===========================================
                  FLOOR
              =========================================== */}

              <div className="pre-guest-field">

                <label>
                  Floor Number *
                </label>

                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) =>
                    setFloorNumber(
                      e.target.value
                    )
                  }
                  placeholder="Floor number"
                  disabled={
                    loading ||
                    !!selectedFlat
                  }
                  className="pre-guest-input"
                />

              </div>

              {/* ===========================================
                  FLAT TYPE
              =========================================== */}

              <div className="pre-guest-field">

                <label>
                  Flat Type *
                </label>

                <input
                  type="text"
                  value={flatType}
                  onChange={(e) =>
                    setFlatType(
                      e.target.value
                    )
                  }
                  placeholder="Flat type"
                  disabled={
                    loading ||
                    !!selectedFlat
                  }
                  className="pre-guest-input"
                />

              </div>

              {/* ===========================================
                  FLAT OWNER MOBILE
              =========================================== */}

              <div className="pre-guest-field">

                <label>
                  Flat Owner Mobile *
                </label>

                <input
                  type="tel"
                  value={flatOwnerMobile}
                  onChange={(e) =>
                    setFlatOwnerMobile(
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(0, 10)
                    )
                  }
                  placeholder="Flat owner mobile"
                  maxLength={10}
                  disabled={
                    loading ||
                    !!selectedFlat
                  }
                  className="pre-guest-input"
                />

              </div>

              {/* ===========================================
                  CREATOR MOBILE - OPTIONAL
              =========================================== */}

              <div className="pre-guest-field">

                <label>
                  Creator Mobile
                </label>

                <input
                  type="tel"
                  value={creatorMobile}
                  onChange={(e) =>
                    setCreatorMobile(
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(0, 10)
                    )
                  }
                  placeholder="Enter creator mobile (optional)"
                  maxLength={10}
                  disabled={
                    loading ||
                    !!selectedFlat
                  }
                  className="pre-guest-input"
                />

              </div>

            </div>

            {/* =============================================
                SELECTED FLAT
            ============================================= */}

            {selectedFlat && (
              <div className="pre-guest-selected-flat">

                <div className="pre-guest-selected-flat-title">
                  ✅ Flat Selected
                </div>

                <div className="pre-guest-selected-flat-details">

                  <span>
                    <strong>FID:</strong>{" "}
                    {selectedFlat.fid}
                  </span>

                  <span>
                    <strong>Owner:</strong>{" "}
                    {selectedFlat.ownerName}
                  </span>

                  <span>
                    <strong>Flat:</strong>{" "}
                    {selectedFlat.flatNumber}
                  </span>

                  <span>
                    <strong>Floor:</strong>{" "}
                    {selectedFlat.floorNumber}
                  </span>

                  <span>
                    <strong>Type:</strong>{" "}
                    {selectedFlat.flatType}
                  </span>

                  <span>
                    <strong>Owner Mobile:</strong>{" "}
                    {flatOwnerMobile}
                  </span>

                </div>
              </div>
            )}

          </div>

          {/* ===============================================
              GUEST IMAGE
          =============================================== */}

          <div className="pre-guest-section">

            <h2>
              📷 Guest Photo
            </h2>

            <div className="pre-guest-image-container">

              <div className="pre-guest-field">

                <label>
                  Guest Image *
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  disabled={loading}
                  className="pre-guest-input"
                />

              </div>

              {previewImage && (
                <div className="pre-guest-image-preview">

                  <img
                    src={previewImage}
                    alt="Guest preview"
                  />

                </div>
              )}

            </div>
          </div>

          {/* ===============================================
              LOADING MESSAGE
          =============================================== */}

          {loading &&
            loadingMessage && (
              <div className="pre-guest-loading">
                {loadingMessage}
              </div>
            )}

          {/* ===============================================
              BUTTONS
          =============================================== */}

          <div className="pre-guest-actions">

            <button
              type="button"
              onClick={clearFormFields}
              disabled={loading}
              className="pre-guest-btn secondary"
            >
              ↩️ Clear
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                loadingPreFlat
              }
              className="pre-guest-btn primary"
            >
              {loading
                ? "⏳ Registering..."
                : "🚪 Register Guest"}
            </button>

          </div>

          {/* ===============================================
              REGISTERED ID
          =============================================== */}

          {registeredGuestId && (
            <div className="pre-guest-registered-id">

              🎉 Registered Guest ID:

              <strong>
                {" "}
                {registeredGuestId}
              </strong>

            </div>
          )}

        </form>

      </div>
    </div>
  );
};

export default PreGuest;