import { useState } from "react";
import Card from "../components/Card";
import "../styles/dashboard.css";
import {formatCurrency} from "../utils/common";

interface User {
  guestVisitor?: number;
  incidentCount?: number;
  ownReconcileAmt?: number;
  overallTotalReconcile?: number;
  ownFailedReconcile?: number;
  overallFailedTotalReconcile?: number;
}

const Dashboard: React.FC = () => {

  const [user] = useState<User>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  console.log("User in Dashboard:", user);

 const dashboardCards = [
  { title: "Guest Visitor", value: user.guestVisitor ?? 0 },
  { title: "Incident Count", value: user.incidentCount ?? 0 },
  { title: "Own Reconcile Amount", value: formatCurrency(user.ownReconcileAmt ?? 0) },
  { title: "Overall Reconcile Amount", value: formatCurrency(user.overallTotalReconcile ?? 0) },
  { title: "Own Failed Transaction", value: formatCurrency(user.ownFailedReconcile ?? 0) },
  { title: "Overall Failed Transaction", value: formatCurrency(user.overallFailedTotalReconcile ?? 0) }
];

  return (
    <div className="dashboard-container">

      <div className="dashboard-grid">

        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
          />
        ))}

      </div>

    </div>
  );
};

export default Dashboard;