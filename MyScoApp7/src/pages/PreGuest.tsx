import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { PreGuestAddAPI } from "../api/authApi";
import "../styles/PreGuest.css";

const PreGuest: React.FC = () => {
  const navigate = useNavigate();

  // =========================
  // Guest Details
  // =========================
  const [gName, setGName] = useState<string>("");
  const [gMobile, setGMobile] = useState<string>("");
  const [gEmail, setGEmail] = useState<string>("");

  // =========================
  // Visit Details
  // =========================
  const [inDateTime, setInDateTime] = useState<string>("");
  const [outDateTime, setOutDateTime] = useState<string>("");

  // =========================
  // Flat Details
  // =========================
  const [floorNumber, setFloorNumber] = useState<string>("");
  const [flatNumber, setFlatNumber] = useState<string>("");
  const [flatType, setFlatType] = useState<string>("");

  // =========================
  // Contact Details
  // =========================
  const [flatOwnerMobile, setFlatOwnerMobile] =
    useState<string>("");

  const [creatorMobile, setCreatorMobile] =
    useState<string>("");

  // =========================
  // UI State
  // =========================
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // =========================
  // Convert datetime-local
  // to ISO format
  // =========================
  const convertToISO = (
    dateTime: string
  ): string | null => {
    if (!dateTime) {
      return null;
    }

    return new Date(dateTime).toISOString();
  };

  // =========================
  // Mobile Number Handler
  // =========================
  const handleMobileChange = (
    value: string,
    setter: React.Dispatch<
      React.SetStateAction<string>
    >
  ) => {
    const numericValue = value.replace(/\D/g, "");

    setter(numericValue.substring(0, 10));
  };

  // =========================
  // Validate Form
  // =========================
  const validateForm = (): boolean => {
    setError("");

    if (!gName.trim()) {
      setError(
        "👤 Guest name is required | पाहुण्याचे नाव आवश्यक आहे | अतिथि का नाम आवश्यक है"
      );
      return false;
    }

    if (!gMobile.trim()) {
      setError(
        "📱 Guest mobile number is required | पाहुण्याचा मोबाईल क्रमांक आवश्यक आहे | अतिथि का मोबाइल नंबर आवश्यक है"
      );
      return false;
    }

    if (!/^[0-9]{10}$/.test(gMobile)) {
      setError(
        "📱 Please enter a valid 10 digit guest mobile number | कृपया 10 अंकी पाहुण्याचा मोबाईल क्रमांक टाका | कृपया 10 अंकों का अतिथि मोबाइल नंबर दर्ज करें"
      );
      return false;
    }

    // Email is optional
    if (gEmail.trim()) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(gEmail.trim())) {
        setError(
          "📧 Please enter a valid email address | कृपया योग्य ई-मेल पत्ता टाका | कृपया सही ईमेल पता दर्ज करें"
        );
        return false;
      }
    }

    if (!floorNumber.trim()) {
      setError(
        "🏢 Floor number is required | मजला क्रमांक आवश्यक आहे | फ्लोर नंबर आवश्यक है"
      );
      return false;
    }

    if (!flatNumber.trim()) {
      setError(
        "🏠 Flat number is required | फ्लॅट क्रमांक आवश्यक आहे | फ्लैट नंबर आवश्यक है"
      );
      return false;
    }

    if (!flatOwnerMobile.trim()) {
      setError(
        "📱 Flat owner mobile number is required | फ्लॅट मालकाचा मोबाईल क्रमांक आवश्यक आहे | फ्लैट मालिक का मोबाइल नंबर आवश्यक है"
      );
      return false;
    }

    if (!/^[0-9]{10}$/.test(flatOwnerMobile)) {
      setError(
        "📱 Please enter a valid 10 digit flat owner mobile number | कृपया फ्लॅट मालकाचा 10 अंकी मोबाईल क्रमांक टाका | कृपया फ्लैट मालिक का 10 अंकों का मोबाइल नंबर दर्ज करें"
      );
      return false;
    }

    if (!creatorMobile.trim()) {
      setError(
        "📱 Creator mobile number is required | तयार करणाऱ्याचा मोबाईल क्रमांक आवश्यक आहे | क्रिएटर का मोबाइल नंबर आवश्यक है"
      );
      return false;
    }

    if (!/^[0-9]{10}$/.test(creatorMobile)) {
      setError(
        "📱 Please enter a valid 10 digit creator mobile number | कृपया तयार करणाऱ्याचा 10 अंकी मोबाईल क्रमांक टाका | कृपया क्रिएटर का 10 अंकों का मोबाइल नंबर दर्ज करें"
      );
      return false;
    }

    // Validate dates
    if (inDateTime && outDateTime) {
      const inDate = new Date(inDateTime);
      const outDate = new Date(outDateTime);

      if (outDate < inDate) {
        setError(
          "📅 Out date/time cannot be earlier than in date/time | बाहेर जाण्याची तारीख/वेळ येण्याच्या तारीख/वेळेपेक्षा आधी असू शकत नाही | बाहर जाने की तारीख/समय आने की तारीख/समय से पहले नहीं हो सकता"
        );

        return false;
      }
    }

    return true;
  };

  // =========================
  // Clear Only Form Fields
  // =========================
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
  };

  // =========================
  // Clear Everything
  // =========================
  const handleClear = () => {
    clearFormFields();

    setError("");
    setSuccess("");
  };

  // =========================
  // Register Pre-Guest
  // =========================
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const currentDateTime =
        new Date().toISOString();

      const finalInDateTime =
        convertToISO(inDateTime) ??
        currentDateTime;

      const finalOutDateTime =
        convertToISO(outDateTime);

      const requestData = {
        gid: 0,
        gName: gName.trim(),
        gMobile: gMobile.trim(),
        gEmail: gEmail.trim(),

        inDateTime: finalInDateTime,
        outDateTime: finalOutDateTime,

        fid: 0,

        status: "PENDING",

        isDeleted: false,

        createdBy: gName.trim(),
        createdDateTime: currentDateTime,

        updatedBy: null,
        updatedDateTime: currentDateTime,

        floorNumber: floorNumber.trim(),
        flatNumber: flatNumber.trim(),
        flatType: flatType.trim(),

        gImagePath: "string",

        flatOwnerMobile:
          flatOwnerMobile.trim(),

        creatorMobile:
          creatorMobile.trim(),

        loginID: 0,

        flag: "IN",
      };

      console.log(
        "PreGuest Registration Request:",
        requestData
      );

      // No token required
      const result =
        await PreGuestAddAPI(requestData);

      console.log(
        "PreGuest Registration Response:",
        result
      );

      // =========================
      // SUCCESS
      // =========================
      if (result?.gid) {
        const guestId = result.gid;

        // Clear only form fields.
        // DO NOT clear success message.
        clearFormFields();

        setSuccess(
          `✅ Registration successful / नोंदणी यशस्वी / पंजीकरण सफल\n\n` +
          `👤 Guest ID: ${guestId}\n\n` +
          `🇬🇧 Guest has been registered successfully.\n` +
          `🇮🇳 पाहुण्याची नोंदणी यशस्वी झाली आहे.\n` +
          `🇮🇳 अतिथि का पंजीकरण सफलतापूर्वक हो गया है।`
        );

        return;
      }

      // =========================
      // API returned no GID
      // =========================
      setError(
        "❌ Registration failed / नोंदणी अयशस्वी / पंजीकरण असफल"
      );
    } catch (error: unknown) {
      console.error(
        "PreGuest Registration Error:",
        error
      );

      // =========================
      // Axios Error
      // =========================
      if (isAxiosError(error)) {
        console.error(
          "API Error Response:",
          error.response?.data
        );

        const apiMessage =
          error.response?.data?.message;

        if (apiMessage) {
          setError(
            `❌ ${apiMessage}\n\n` +
            `🇬🇧 Please try again.\n` +
            `🇮🇳 कृपया पुन्हा प्रयत्न करा.\n` +
            `🇮🇳 कृपया पुनः प्रयास करें।`
          );
        } else {
          setError(
            "❌ Unable to register guest / पाहुण्याची नोंदणी करता आली नाही / अतिथि का पंजीकरण नहीं हो सका"
          );
        }
      }

      // =========================
      // Normal Error
      // =========================
      else if (error instanceof Error) {
        setError(
          `⚠️ ${error.message}\n\n` +
          `🇬🇧 Please try again later.\n` +
          `🇮🇳 कृपया नंतर पुन्हा प्रयत्न करा.\n` +
          `🇮🇳 कृपया बाद में पुनः प्रयास करें।`
        );
      }

      // =========================
      // Unknown Error
      // =========================
      else {
        setError(
          "⚠️ Unable to connect to server / सर्व्हरशी कनेक्ट होता आले नाही / सर्वर से कनेक्ट नहीं हो सका"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="pre-guest-container">

      {/* Saving Loader */}
      {loading && (
        <div className="pre-guest-loading-overlay">
          <div className="pre-guest-loader-box">

            <div className="pre-guest-spinner"></div>

            <div className="pre-guest-loading-title">
              Saving Guest...
            </div>

            <div className="pre-guest-loading-message">
              Please wait / कृपया प्रतीक्षा करा / कृपया प्रतीक्षा करें
            </div>

          </div>
        </div>
      )}

      {/* Right Panel */}
      <div className="pre-guest-right">

        <div className="pre-guest-card">

          {/* Header */}
          <h2 className="pre-guest-title">
            👤 Pre-Guest Registration
          </h2>

          <p className="pre-guest-subtitle">
            Register your guest before their arrival
            <br />
            पाहुण्याच्या आगमनापूर्वी नोंदणी करा
            <br />
            अतिथि के आने से पहले पंजीकरण करें
          </p>

          {/* Error */}
          {error && (
            <div className="pre-guest-error">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="pre-guest-success">
              {success}
            </div>
          )}

          {/* Guest Details */}
          <div className="section-title">
            👤 Guest Details / पाहुण्याची माहिती / अतिथि विवरण
          </div>

          <div className="form-row">

            <input
              type="text"
              placeholder="Guest Name *"
              value={gName}
              onChange={(e) =>
                setGName(e.target.value)
              }
              className="pre-guest-input"
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Guest Mobile *"
              value={gMobile}
              maxLength={10}
              inputMode="numeric"
              onChange={(e) =>
                handleMobileChange(
                  e.target.value,
                  setGMobile
                )
              }
              className="pre-guest-input"
              disabled={loading}
            />

          </div>

          <input
            type="email"
            placeholder="Guest Email"
            value={gEmail}
            onChange={(e) =>
              setGEmail(e.target.value)
            }
            className="pre-guest-input full-width"
            disabled={loading}
          />

          {/* Visit Details */}
          <div className="section-title">
            📅 Visit Details / भेटीची माहिती / यात्रा विवरण
          </div>

          <div className="form-row">

            <div className="date-field">

              <label>
                In Date & Time
                <br />
                येण्याची तारीख व वेळ
                <br />
                आने की तारीख और समय
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

            <div className="date-field">

              <label>
                Out Date & Time
                <br />
                जाण्याची तारीख व वेळ
                <br />
                जाने की तारीख और समय
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

          {/* Flat Details */}
          <div className="section-title">
            🏢 Flat Details / फ्लॅटची माहिती / फ्लैट विवरण
          </div>

          <div className="form-row">

            <input
              type="text"
              placeholder="Floor Number *"
              value={floorNumber}
              onChange={(e) =>
                setFloorNumber(
                  e.target.value
                )
              }
              className="pre-guest-input"
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Flat Number *"
              value={flatNumber}
              onChange={(e) =>
                setFlatNumber(
                  e.target.value
                )
              }
              className="pre-guest-input"
              disabled={loading}
            />

          </div>

          <input
            type="text"
            placeholder="Flat Type"
            value={flatType}
            onChange={(e) =>
              setFlatType(e.target.value)
            }
            className="pre-guest-input full-width"
            disabled={loading}
          />

          {/* Contact Details */}
          <div className="section-title">
            📱 Contact Details / संपर्क माहिती / संपर्क विवरण
          </div>

          <div className="form-row">

            <input
              type="text"
              placeholder="Flat Owner Mobile *"
              value={flatOwnerMobile}
              maxLength={10}
              inputMode="numeric"
              onChange={(e) =>
                handleMobileChange(
                  e.target.value,
                  setFlatOwnerMobile
                )
              }
              className="pre-guest-input"
              disabled={loading}
            />

            <input
              type="text"
              placeholder="Creator Mobile *"
              value={creatorMobile}
              maxLength={10}
              inputMode="numeric"
              onChange={(e) =>
                handleMobileChange(
                  e.target.value,
                  setCreatorMobile
                )
              }
              className="pre-guest-input"
              disabled={loading}
            />

          </div>

          {/* Buttons */}
          <div className="pre-guest-buttons">

            <button
              type="button"
              className="pre-guest-cancel-button"
              onClick={() =>
                navigate("/dashboard")
              }
              disabled={loading}
            >
              ← Cancel
            </button>

            <button
              type="button"
              className="pre-guest-clear-button"
              onClick={handleClear}
              disabled={loading}
            >
              🧹 Clear
            </button>

            <button
              type="button"
              className="pre-guest-button"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "👤 Register Guest"}
            </button>

          </div>

          {/* Footer */}
          <div className="pre-guest-footer">
            Secure visitor registration · My Society
            Enterprise App
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreGuest;
