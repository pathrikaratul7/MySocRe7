import React from "react";

type Props = {
  title: string;
  value: string | number;
  extra?: React.ReactNode;
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "24px",
  minWidth: "200px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  textAlign: "center"
};

const titleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "10px"
};

const valueStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 600,
  color: "#111827"
};

const extraStyle: React.CSSProperties = {
  marginTop: "12px"
};

const Card: React.FC<Props> = ({ title, value, extra }) => {
  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
      }}
    >
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>

      {}
      {extra && <div style={extraStyle}>{extra}</div>}
    </div>
  );
};

export default Card;