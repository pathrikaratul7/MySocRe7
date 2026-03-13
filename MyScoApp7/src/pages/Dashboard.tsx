import Card from "../components/Card";


const Dashboard = () => {

const cards= [

{title: "Users", value:120},
{title: "Orders", value: 80},
{title: "Revenue", value: 5000},
{title: "Products", value: 5000}


];

return(
<div style={{padding: "30px"}}>
<h2>Dashboard</h2>
<div style={{display: "flex", gap:"20px"}}>
    {cards.map((card, index) => (
        <Card key={index} title={card.title} value={card.value} />
    ))}
</div>
</div>
);
}

export default Dashboard;