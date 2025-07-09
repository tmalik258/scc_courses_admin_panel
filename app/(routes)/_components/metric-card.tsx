import React from 'react';
import { MetricCardProps } from '@/types';

interface ClickableMetricCardProps extends MetricCardProps {
  onClick?: () => void;
}

const MetricCard: React.FC<ClickableMetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  onClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <button 
        onClick={onClick}
        className="text-blue-500 text-sm mt-2 flex items-center hover:text-blue-700"
      >
        View Details →
      </button>
    </div>
  );
};

export default MetricCard;