import Card from "../components/Card";
import "../styles/dashboard.css";
import {formatCurrency} from "../utils/common";
import { GetUserDetails } from "../api/authApi";
import { useEffect, useState } from "react";

interface UserData {
  guestVisitor?: number;
  incidentCount?: number;
  ownReconcileAmt?: number;
  overallTotalReconcile?: number;
  ownFailedReconcile?: number;
  overallFailedTotalReconcile?: number;
}

// const fetchUserDetails = async () => {
//   const user = await GetUserDetails(localStorage.getItem("token") || "", localStorage.getItem("uEmail") || "", localStorage.getItem("uPass") || "");
//   console.log("User:", user);

//   return user;
// };

    const Dashboard: React.FC = () =>{

  
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await GetUserDetails(
          localStorage.getItem("token") || "",
          localStorage.getItem("uEmail") || "",
          localStorage.getItem("uPass") || ""
        );

        console.log("User:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserDetails();
  }, []);

     




  console.log("User in Dashboard:", user);

 const dashboardCards = [
  { title: "Guest Visitor", value: user?.guestVisitor ?? 0 },
  { title: "Incident Count", value: user?.incidentCount ?? 0 },
  { title: "Own Reconcile Amount", value: formatCurrency(user?.ownReconcileAmt ?? 0) },
  { title: "Overall Reconcile Amount", value: formatCurrency(user?.overallTotalReconcile ?? 0) },
  { title: "Own Failed Transaction", value: formatCurrency(user?.ownFailedReconcile ?? 0) },
  { title: "Overall Failed Transaction", value: formatCurrency(user?.overallFailedTotalReconcile ?? 0) }
];

  return (
    <div className="dashboard-container">

      <div className="dashboard-grid">

       {dashboardCards.map((card, index) => (
  <Card
    key={index}
    title={card.title}
    value={card.value}
    extra={
      <button className="view-btn">
        👁️ View
      </button>
    }
  />
))}

      </div>

    </div>
  );
};

export default Dashboard;