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
  { title: "👥 Guest Visitor", value: user?.guestVisitor ?? 0, raw: Number(user?.guestVisitor ?? 0) },
  { title: "🚨 Incident Count", value: user?.incidentCount ?? 0, raw: Number(user?.incidentCount ?? 0) },
  { title: "💰 Own Reconcile Amount", value: formatCurrency(user?.ownReconcileAmt ?? 0), raw: Number(user?.ownReconcileAmt ?? 0) },
  { title: "📊 Overall Reconcile Amount", value: formatCurrency(user?.overallTotalReconcile ?? 0), raw: Number(user?.overallTotalReconcile ?? 0) },
  { title: "❌ Own Failed Transaction", value: formatCurrency(user?.ownFailedReconcile ?? 0), raw: Number(user?.ownFailedReconcile ?? 0) },
  { title: "⚠️ Overall Failed Transaction", value: formatCurrency(user?.overallFailedTotalReconcile ?? 0), raw: Number(user?.overallFailedTotalReconcile ?? 0) }
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
  card.raw > 0 ? (
    <button className="view-btn" onClick={gotto}>
      👁️ View
    </button>
  ) : <div style={{ marginTop: "12px", color: "red" }}>No details available</div>
}
  />
))}

      </div>

    </div>
  );
};

export default Dashboard;