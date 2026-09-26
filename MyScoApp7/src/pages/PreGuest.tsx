import React, {
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { isAxiosError } from "axios";

import {
  PreGuestAddAPI,
  UploadGuestImageAPI,
  type PreGuestRequest,
} from "../api/authApi";

import "../styles/PreGuest.css";

const PreGuest: React.FC = () => {
  const navigate = useNavigate();

  // =====================================================
  // Form Fields
  // =====================================================

  const [gName, setGName] = useState("");
  const [gMobile, setGMobile] = useState("");
  const [gEmail, setGEmail] = useState("");

  const [inDateTime, setInDateTime] =
    useState("");

  const [outDateTime, setOutDateTime] =
    useState("");

  const [floorNumber, setFloorNumber] =
    useState("");

  const [flatNumber, setFlatNumber] =
    useState("");

  const [flatType, setFlatType] =
    useState("");

  const [flatOwnerMobile, setFlatOwnerMobile] =
    useState("");

  const [creatorMobile, setCreatorMobile] =
    useState("");

  // =====================================================
  // Guest Image
  // =====================================================

  const [guestImage, setGuestImage] =
    useState<File | null>(null);

  const [guestImagePreview, setGuestImagePreview] =
    useState("");

  const guestImageInputRef =
    useRef<HTMLInputElement | null>(null);

  // =====================================================
  // UI State
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [loadingMessage, setLoadingMessage] =
    useState("Saving Guest...");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [registeredGuestId, setRegisteredGuestId] =
    useState<number | null>(null);

  // =====================================================
  // Convert datetime-local to ISO
  // =====================================================

  const convertToISO = (
    value: string
  ): string => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    return date.toISOString();
  };

  // =====================================================
  // Mobile Number Change
  // =====================================================

  const handleMobileChange = (
    value: string,
    setter: React.Dispatch<
      React.SetStateAction<string>
    >
  ) => {
    const digitsOnly = value
      .replace(/\D/g, "")
      .slice(0, 10);

    setter(digitsOnly);
  };

  // =====================================================
  // Guest Image Selection / Camera
  // =====================================================

  const handleGuestImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // -------------------------------------------------
    // Validate Image Type
    // -------------------------------------------------

    const extension =
      "." +
      (
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || ""
      );

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".heic",
      ".heif",
    ];

    const isImage =
      file.type.startsWith("image/") ||
      allowedExtensions.includes(extension);

    if (!isImage) {
      setError(
        "🖼️ Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    // -------------------------------------------------
    // Validate Image Size
    // -------------------------------------------------

    const maxSize =
      5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
      setError(
        "🖼️ Image size must be less than 5 MB."
      );

      event.target.value = "";

      return;
    }

    // -------------------------------------------------
    // Store File
    // -------------------------------------------------

    setError("");

    setGuestImage(file);

    // -------------------------------------------------
    // Create Preview
    // -------------------------------------------------

    const reader =
      new FileReader();

    reader.onload = () => {
      setGuestImagePreview(
        String(reader.result)
      );
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // Remove Guest Image
  // =====================================================

  const clearGuestImage = () => {
    setGuestImage(null);

    setGuestImagePreview("");

    if (guestImageInputRef.current) {
      guestImageInputRef.current.value = "";
    }
  };

  // =====================================================
  // Clear Form
  // =====================================================

  const clearFormFields = () => {
    setGName("");
    setGMobile("");
    setGEmail("");

    setInDateTime("");
    setOutDateTime("");

    setFloorNumber("");
    setFlatNumber("");
    setFlatType("");

    setFlatOwnerMobile("");
    setCreatorMobile("");

    clearGuestImage();

    setError("");
  };

  // =====================================================
  // Register Guest
  // =====================================================

  const handleRegister = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setRegisteredGuestId(null);

    // =================================================
    // Validation
    // =================================================

    if (!gName.trim()) {
      setError(
        "👤 Please enter guest name."
      );

      return;
    }

    if (
      !gMobile.trim() ||
      gMobile.length !== 10
    ) {
      setError(
        "📱 Please enter a valid 10-digit guest mobile number."
      );

      return;
    }

    // -------------------------------------------------
    // Email Validation
    // -------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      gEmail.trim() &&
      !emailRegex.test(gEmail.trim())
    ) {
      setError(
        "📧 Please enter a valid email address."
      );

      return;
    }

    // -------------------------------------------------
    // Entry Date
    // -------------------------------------------------

    if (!inDateTime) {
      setError(
        "📅 Please select expected entry date/time."
      );

      return;
    }

    // -------------------------------------------------
    // Floor
    // -------------------------------------------------

    if (!floorNumber.trim()) {
      setError(
        "🏢 Please enter floor number."
      );

      return;
    }

    // -------------------------------------------------
    // Flat
    // -------------------------------------------------

    if (!flatNumber.trim()) {
      setError(
        "🏠 Please enter flat number."
      );

      return;
    }

    // -------------------------------------------------
    // Flat Owner Mobile
    // -------------------------------------------------

    if (
      !flatOwnerMobile.trim() ||
      flatOwnerMobile.length !== 10
    ) {
      setError(
        "📱 Please enter a valid 10-digit flat owner mobile number."
      );

      return;
    }

    // -------------------------------------------------
    // Creator Mobile
    // -------------------------------------------------

    if (
      !creatorMobile.trim() ||
      creatorMobile.length !== 10
    ) {
      setError(
        "📱 Please enter a valid 10-digit creator mobile number."
      );

      return;
    }

    // -------------------------------------------------
    // Guest Image
    // -------------------------------------------------

    if (!guestImage) {
      setError(
        "📷 Please capture or select the guest image."
      );

      return;
    }

    // =================================================
    // API Process
    // =================================================

    try {
      setLoading(true);

      // =================================================
      // STEP 1
      // Upload Guest Image
      // =================================================

      setLoadingMessage(
        "Uploading guest photo..."
      );

      /*
       * UploadGuestImageAPI already converts the
       * server response into:
       *
       * /images/GuestImg/filename.jpg
       */

      const guestImagePath =
        await UploadGuestImageAPI(
          guestImage
        );

      if (!guestImagePath) {
        throw new Error(
          "Image upload failed. Server did not return file path."
        );
      }

      console.log(
        "✅ Guest Image Path:",
        guestImagePath
      );

      // =================================================
      // STEP 2
      // Save Guest Registration
      // =================================================

      setLoadingMessage(
        "Saving guest registration..."
      );

      const requestData: PreGuestRequest = {
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

        fid: 0,

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

        // -----------------------------------------------
        // Uploaded image path
        // -----------------------------------------------

        gImagePath:
          guestImagePath,

        flatOwnerMobile:
          flatOwnerMobile.trim(),

        creatorMobile:
          creatorMobile.trim(),

        loginID:
          0,

        flag:
          "IN",
      };

      console.log(
        "📤 PreGuest Request:",
        requestData
      );

      // =================================================
      // STEP 3
      // Call PreGuest API
      // =================================================

      const result =
        await PreGuestAddAPI(
          requestData
        );

      console.log(
        "✅ Guest Registration Response:",
        result
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (result?.gid) {
        const guestId =
          Number(result.gid);

        setRegisteredGuestId(
          guestId
        );

        clearFormFields();

        setSuccess(
          "Registration successful / नोंदणी यशस्वी / पंजीकरण सफल"
        );

        return;
      }

      // =================================================
      // API returned unexpected response
      // =================================================

      throw new Error(
        "Guest registration failed."
      );
    } catch (err) {
      console.error(
        "❌ Guest registration failed:",
        err
      );

      // =================================================
      // Axios Error
      // =================================================

      if (isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.message ||
          err.response?.data?.title;

        setError(
          serverMessage ||
            "Unable to register guest. Please try again."
        );
      }

      // =================================================
      // Normal Error
      // =================================================

      else if (
        err instanceof Error
      ) {
        setError(
          err.message
        );
      }

      // =================================================
      // Unknown Error
      // =================================================

      else {
        setError(
          "Unable to register guest. Please try again."
        );
      }
    } finally {
      setLoading(false);

      setLoadingMessage(
        "Saving Guest..."
      );
    }
  };

  // =====================================================
  // Cancel
  // =====================================================

  const handleCancel = () => {
    navigate("/");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="pre-guest-page">

      <div className="pre-guest-container">

        {/* =========================================
            Header
        ========================================== */}

        <div className="pre-guest-header">

          <h1>
            Guest Registration
          </h1>

          <p>
            Pre-register your guest before arrival
          </p>

        </div>

        {/* =========================================
            Error Message
        ========================================== */}

        {error && (
          <div className="pre-guest-error">
            {error}
          </div>
        )}

        {/* =========================================
            Success Message
        ========================================== */}

        {success &&
          registeredGuestId && (

            <div className="pre-guest-success-card">

              <div className="pre-guest-success-icon">
                ✅
              </div>

              <h2>
                {success}
              </h2>

              <div className="pre-guest-gid">

                <span>
                  Guest ID
                </span>

                <strong>
                  {registeredGuestId}
                </strong>

              </div>

              <div className="pre-guest-success-message">

                <p>
                  🔐 Keep this GID handy or take a
                  screenshot and show it to the
                  Security Guard.
                </p>

                <p>
                  🔐 हा GID जवळ ठेवा किंवा स्क्रीनशॉट
                  घेऊन Security Guard ला दाखवा.
                </p>

                <p>
                  🔐 इस GID को संभालकर रखें या
                  स्क्रीनशॉट लेकर Security Guard को
                  दिखाएं।
                </p>

              </div>

              <button
                type="button"
                className="pre-guest-primary-button"
                onClick={() => {
                  setSuccess("");
                  setRegisteredGuestId(null);
                }}
              >
                Register Another Guest
              </button>

            </div>
          )}

        {/* =========================================
            Registration Form
        ========================================== */}

        {!registeredGuestId && (

          <form
            onSubmit={handleRegister}
            className="pre-guest-form"
          >

            {/* =====================================
                Guest Information
            ====================================== */}

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
                    className="pre-guest-input"
                    placeholder="Enter guest name"
                    disabled={loading}
                  />

                </div>

                {/* Guest Mobile */}

                <div className="pre-guest-field">

                  <label>
                    Guest Mobile *
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={gMobile}
                    onChange={(e) =>
                      handleMobileChange(
                        e.target.value,
                        setGMobile
                      )
                    }
                    className="pre-guest-input"
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    disabled={loading}
                  />

                </div>

                {/* Email */}

                <div className="pre-guest-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={gEmail}
                    onChange={(e) =>
                      setGEmail(
                        e.target.value
                      )
                    }
                    className="pre-guest-input"
                    placeholder="guest@example.com"
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

            {/* =====================================
                Guest Photo
            ====================================== */}

            <div className="pre-guest-section">

              <h2>
                📷 Guest Photo
              </h2>

              <div className="pre-guest-image-section">

                {/* Hidden File Input */}

                <input
                  ref={
                    guestImageInputRef
                  }
                  id="guest-image"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={
                    handleGuestImageChange
                  }
                  disabled={loading}
                  className="pre-guest-file-input"
                />

                {/* Camera / Gallery Button */}

                <label
                  htmlFor="guest-image"
                  className="pre-guest-image-button"
                >
                  📷 Capture / Select Guest Photo
                </label>

                <p className="pre-guest-image-help">

                  On mobile, your browser may open
                  the camera. On desktop, you can
                  select an image file.

                  <br />

                  Maximum size: 5 MB.

                </p>

                {/* Image Preview */}

                {guestImagePreview && (

                  <div className="pre-guest-image-preview-container">

                    <img
                      src={
                        guestImagePreview
                      }
                      alt="Guest preview"
                      className="pre-guest-image-preview"
                    />

                    <div className="pre-guest-image-name">

                      {guestImage?.name}

                    </div>

                    <button
                      type="button"
                      className="pre-guest-remove-image"
                      onClick={
                        clearGuestImage
                      }
                      disabled={loading}
                    >
                      🗑️ Remove Photo
                    </button>

                  </div>

                )}

              </div>

            </div>

            {/* =====================================
                Visit Details
            ====================================== */}

            <div className="pre-guest-section">

              <h2>
                📅 Visit Details
              </h2>

              <div className="pre-guest-grid">

                {/* In Date */}

                <div className="pre-guest-field">

                  <label>
                    Expected In Date & Time *
                  </label>

                  <input
                    type="datetime-local"
                    value={inDateTime}
                    onChange={(e) =>
                      setInDateTime(
                        e.target.value
                      )
                    }
                    className="pre-guest-input"
                    disabled={loading}
                  />

                </div>

                {/* Out Date */}

                <div className="pre-guest-field">

                  <label>
                    Expected Out Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={outDateTime}
                    onChange={(e) =>
                      setOutDateTime(
                        e.target.value
                      )
                    }
                    className="pre-guest-input"
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

            {/* =====================================
                Flat Details
            ====================================== */}

            <div className="pre-guest-section">

              <h2>
                🏠 Flat Details
              </h2>

              <div className="pre-guest-grid">

                {/* Floor Number */}

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
                    className="pre-guest-input"
                    placeholder="Example: 3"
                    disabled={loading}
                  />

                </div>

                {/* Flat Number */}

                <div className="pre-guest-field">

                  <label>
                    Flat Number *
                  </label>

                  <input
                    type="text"
                    value={flatNumber}
                    onChange={(e) =>
                      setFlatNumber(
                        e.target.value
                      )
                    }
                    className="pre-guest-input"
                    placeholder="Example: 302"
                    disabled={loading}
                  />

                </div>

                {/* Flat Type */}

                <div className="pre-guest-field">

                  <label>
                    Flat Type
                  </label>

                  <input
                    type="text"
                    value={flatType}
                    onChange={(e) =>
                      setFlatType(
                        e.target.value
                      )
                    }
                    className="pre-guest-input"
                    placeholder="Example: 2 BHK"
                    disabled={loading}
                  />

                </div>

                {/* Flat Owner Mobile */}

                <div className="pre-guest-field">

                  <label>
                    Flat Owner Mobile *
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={flatOwnerMobile}
                    onChange={(e) =>
                      handleMobileChange(
                        e.target.value,
                        setFlatOwnerMobile
                      )
                    }
                    className="pre-guest-input"
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    disabled={loading}
                  />

                </div>

                {/* Creator Mobile */}

                <div className="pre-guest-field">

                  <label>
                    Creator Mobile *
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={creatorMobile}
                    onChange={(e) =>
                      handleMobileChange(
                        e.target.value,
                        setCreatorMobile
                      )
                    }
                    className="pre-guest-input"
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

            {/* =====================================
                Buttons
            ====================================== */}

            <div className="pre-guest-buttons">

              <button
                type="button"
                className="pre-guest-cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="pre-guest-primary-button"
                disabled={loading}
              >
                {loading
                  ? "Please Wait..."
                  : "Register Guest"}
              </button>

            </div>

          </form>
        )}

      </div>

      {/* =========================================
          Loading Overlay
      ========================================== */}

      {loading && (

        <div className="pre-guest-loading-overlay">

          <div className="pre-guest-loader-box">

            <div className="pre-guest-spinner">
            </div>

            <div className="pre-guest-loading-title">

              {loadingMessage}

            </div>

            <div className="pre-guest-loading-message">

              Please wait...

              <br />

              कृपया प्रतीक्षा करा...

              <br />

              कृपया प्रतीक्षा करें...

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default PreGuest;
