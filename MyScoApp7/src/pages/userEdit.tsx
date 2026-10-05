import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddUserAPI,
  GetAllUsersfromAPp,
  UpdateUserAPI,
  type SocietyUserRecord,
  type SocietyUserRequest,
} from "../api/authApi";
import "../styles/UserEdit.css";

const PRIVILEGES = ["User", "Security", "Admin", "SuperAdmin", "Developer"];
const USER_TYPES = ["Flat Owner/Tenant", "Security", "Cleaning staff"];

interface UserFormValues {
  uName: string;
  uEmail: string;
  uMobile: string;
  uPass: string;
  userType: string;
  privileges: string[];
}

const initialValues: UserFormValues = {
  uName: "",
  uEmail: "",
  uMobile: "",
  uPass: "",
  userType: "Flat Owner/Tenant",
  privileges: ["User"],
};

const errorMessage = (error: unknown): string => {
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

  return error instanceof Error ? error.message : "Unable to save user.";
};

const UserEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreate = !id;
  const [user, setUser] = useState<SocietyUserRecord | null>(null);
  const [values, setValues] = useState<UserFormValues>(initialValues);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let active = true;
    const loadUser = async () => {
      try {
        setLoading(true);
        const users = await GetAllUsersfromAPp(
          localStorage.getItem("token") || "",
          localStorage.getItem("uid") || ""
        );
        const match = users.find((item) => String(item.uid) === id);

        if (!active) return;
        if (!match) {
          setError("User details could not be found.");
          return;
        }

        setUser(match);
        setValues({
          uName: match.uName || "",
          uEmail: match.uEmail || "",
          uMobile: match.uMobile || "",
          uPass: "",
          userType: match.userType || "Flat Owner/Tenant",
          privileges: (match.privList || "")
            .split("|")
            .map((privilege) => privilege.trim())
            .filter(Boolean),
        });
      } catch (loadError: unknown) {
        console.error("Load user error:", loadError);
        if (active) setError(errorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadUser();
    return () => {
      active = false;
    };
  }, [id]);

  const togglePrivilege = (privilege: string) => {
    setValues((current) => ({
      ...current,
      privileges: current.privileges.includes(privilege)
        ? current.privileges.filter((item) => item !== privilege)
        : [...current.privileges, privilege],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const uName = values.uName.trim();
    const uEmail = values.uEmail.trim();
    const uMobile = values.uMobile.trim();
    const uPass = values.uPass;
    if (!uName || !uEmail || !uMobile) {
      setError("Name, email, and mobile are required.");
      return;
    }
    if (isCreate && !uPass) {
      setError("Password is required when adding a user.");
      return;
    }
    if (values.privileges.length === 0) {
      setError("Select at least one privilege.");
      return;
    }

    const now = new Date().toISOString();
    const actor =
      localStorage.getItem("uName") ||
      localStorage.getItem("uEmail") ||
      "string";
    const request: SocietyUserRequest = {
      uid: user?.uid ?? 0,
      uName,
      uEmail,
      ...(uPass ? { uPass } : {}),
      uMobile,
      isDeleted: user?.isDeleted ?? false,
      createdBy: user?.createdBy || actor,
      createdDateTime: user?.createdDateTime || now,
      updatedBy: isCreate ? null : actor,
      updatedDateTime: isCreate ? null : now,
      fid: user?.fid ?? 0,
      flatNumber: user?.flatNumber || "",
      flatType: user?.flatType || "",
      deviceID: user?.deviceID || "string",
      privList: values.privileges.join("|"),
      flag: isCreate ? "IN" : "UP",
      guestVisitor: user?.guestVisitor ?? 0,
      incidentCount: user?.incidentCount ?? 0,
      imagePath: user?.imagePath || "string",
      userType: values.userType,
      ownReconcileAmt: user?.ownReconcileAmt ?? 0,
      ownFailedReconcile: user?.ownFailedReconcile ?? 0,
      overallTotalReconcile: user?.overallTotalReconcile ?? 0,
      overallFailedTotalReconcile: user?.overallFailedTotalReconcile ?? 0,
      pendingTranCount: user?.pendingTranCount ?? 0,
    };

    try {
      setSaving(true);
      const saved = isCreate
        ? await AddUserAPI(request)
        : await UpdateUserAPI(request);

      if (
        !saved ||
        (isCreate && !saved.uid) ||
        (!isCreate && Number(saved.uid) !== request.uid)
      ) {
        throw new Error("The server did not confirm saving this user.");
      }

      await Swal.fire({
        title: isCreate ? "User added" : "User updated",
        text: isCreate
          ? "The new user was added successfully."
          : "User details were updated successfully.",
        icon: "success",
      });
      navigate("/users");
    } catch (saveError: unknown) {
      console.error("Save user error:", saveError);
      setError(errorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="user-edit-container"><p className="loading">Loading user...</p></div>;
  }

  if (!isCreate && !user) {
    return (
      <div className="user-edit-container">
        <div className="user-form-card">
          <p className="user-form-error">{error || "User details could not be found."}</p>
          <button
            type="button"
            className="user-form-secondary"
            onClick={() => navigate("/users")}
          >
            Back to users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-edit-container">
      <form className="user-form-card" onSubmit={handleSubmit}>
        <h2 className="title">{isCreate ? "Add New User" : "Update User"}</h2>
        <p className="user-form-intro">
          {isCreate
            ? "Enter account details and choose the user's privileges."
            : "Update account details and privileges. Leave password blank to keep it unchanged."}
        </p>

        {error && <p className="user-form-error" role="alert">{error}</p>}

        <div className="user-form-grid">
          <label>
            Name
            <input
              value={values.uName}
              onChange={(event) => setValues({ ...values, uName: event.target.value })}
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={values.uEmail}
              onChange={(event) => setValues({ ...values, uEmail: event.target.value })}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Mobile
            <input
              type="tel"
              value={values.uMobile}
              onChange={(event) => setValues({ ...values, uMobile: event.target.value })}
              autoComplete="tel"
              required
            />
          </label>
          <label>
            {isCreate ? "Password" : "Password (unchanged)"}
            <input
              type="password"
              value={values.uPass}
              onChange={(event) => setValues({ ...values, uPass: event.target.value })}
              autoComplete="new-password"
              required={isCreate}
              disabled={!isCreate}
              placeholder={isCreate ? "" : "Existing password will be kept"}
            />
          </label>
          <label>
            User type
            <select
              value={values.userType}
              onChange={(event) =>
                setValues({ ...values, userType: event.target.value })
              }
              required
            >
              {USER_TYPES.map((userType) => (
                <option key={userType} value={userType}>
                  {userType}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="privilege-fieldset">
          <legend>Privileges</legend>
          <div className="privilege-options">
            {PRIVILEGES.map((privilege) => (
              <label className="privilege-option" key={privilege}>
                <input
                  type="checkbox"
                  checked={values.privileges.includes(privilege)}
                  onChange={() => togglePrivilege(privilege)}
                />
                <span>{privilege}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="user-form-actions">
          <button
            type="button"
            className="user-form-secondary"
            onClick={() => navigate("/users")}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="user-form-primary" disabled={saving}>
            {saving ? "Saving..." : isCreate ? "Add user" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
