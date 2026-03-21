import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  extra?: React.ReactNode;
  color?: string;
  icon?: string;
}

const Card: React.FC<CardProps> = ({ title, value, extra, color, icon }) => {
  return (
    <div className="card" style={{ borderLeft: `5px solid ${color}` }}>
      
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>

      <div className="card-value">{value}</div>

      <div className="card-footer">{extra}</div>

    </div>
  );
};

export default Card;