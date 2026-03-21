import Card from "../components/Card";
import "../styles/dashboard.css";
import {formatCurrency} from "../utils/common";
import { saveUID } from "../utils/tokenStorage";
import { useUser } from "../utils/useUser";

const gotto = () => {
  alert("View details functionality is not implemented yet.");
}
  const Dashboard: React.FC = () =>{
  const user  = useUser();
  console.log("User in Dashboard:", user?.uid);
  saveUID(user?.uid|| 0);
  

const dashboardCards = [
  {
    title: "Guest Visitors",
    value: user?.guestVisitor ?? 0,
    raw: Number(user?.guestVisitor ?? 0),
    color: "#3b82f6",
    icon: "👥"
  },
  {
    title: "Incident Count",
    value: user?.incidentCount ?? 0,
    raw: Number(user?.incidentCount ?? 0),
    color: "#ef4444",
    icon: "🚨"
  },
  {
    title: "Own Reconcile",
    value: formatCurrency(user?.ownReconcileAmt ?? 0),
    raw: Number(user?.ownReconcileAmt ?? 0),
    color: "#22c55e",
    icon: "💰"
  },
  {
    title: "Overall Reconcile",
    value: formatCurrency(user?.overallTotalReconcile ?? 0),
    raw: Number(user?.overallTotalReconcile ?? 0),
    color: "#a855f7",
    icon: "📊"
  },
  {
    title: "Own Failed",
    value: formatCurrency(user?.ownFailedReconcile ?? 0),
    raw: Number(user?.ownFailedReconcile ?? 0),
    color: "#f97316",
    icon: "❌"
  },
  {
    title: "Overall Failed",
    value: formatCurrency(user?.overallFailedTotalReconcile ?? 0),
    raw: Number(user?.overallFailedTotalReconcile ?? 0),
    color: "#eab308",
    icon: "⚠️"
  }
];
  return (
    <div className="dashboard-container">

      <div className="dashboard-grid">

      {dashboardCards.map((card, index) => (
  <Card
    key={index}
    title={card.title}
    value={card.value}
    color={card.color}
    icon={card.icon}
    extra={
      card.raw > 0 ? (
        <button className="view-btn" onClick={gotto}>
         👁️ View Details 👁️
        </button>
      ) : (
        <div style={{ color: "#f87171" }}>No data available</div>
      )
    }
  />
))}

      </div>

    </div>
  );
};

export default Dashboard;