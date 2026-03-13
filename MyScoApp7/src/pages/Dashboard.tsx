import Card from "../components/Card";
import "../styles/dashboard.css";

const Dashboard = () => {

  const dashboardCards = [
    { title: "Users", value: 120 },
    { title: "Orders", value: 80 },
    { title: "Revenue", value: "$5,000" },
    { title: "Products", value: 500 }
  ];

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">Dashboard</h2>

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