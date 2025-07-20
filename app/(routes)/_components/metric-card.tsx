import React from "react";
import { MetricCardProps } from "@/types";

interface ClickableMetricCardProps extends MetricCardProps {
  onClick?: () => void;
}

const MetricCard: React.FC<ClickableMetricCardProps> = ({
  title,
  value,
  icon,
  onClick,
}) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-aqua-mist text-sm mt-2 flex items-center hover:text-aqua-depth">
        View Details →
      </div>
    </div>
  );
};

export default MetricCard;
