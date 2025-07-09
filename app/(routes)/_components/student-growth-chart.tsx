import React from 'react';
import { ChartDataPoint } from '@/types';

interface StudentGrowthChartProps {
  data: ChartDataPoint[];
}

const StudentGrowthChart: React.FC<StudentGrowthChartProps> = ({ data }) => {
  const generateSVGPath = (chartData: ChartDataPoint[]) => {
    const width = 400;
    const height = 200;
    const padding = 40;
    
    const xScale = (width - 2 * padding) / (chartData.length - 1);
    const yScale = (height - 2 * padding) / 500;
    
    let path = '';
    
    chartData.forEach((point, index) => {
      const x = padding + index * xScale;
      const y = height - padding - point.value * yScale;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Total Student Growth</h2>
      <div className="h-64">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Y-axis labels */}
          <text x="20" y="30" className="text-xs fill-gray-500">500</text>
          <text x="20" y="70" className="text-xs fill-gray-500">400</text>
          <text x="20" y="110" className="text-xs fill-gray-500">300</text>
          <text x="20" y="150" className="text-xs fill-gray-500">200</text>
          <text x="20" y="190" className="text-xs fill-gray-500">100</text>
          <text x="30" y="210" className="text-xs fill-gray-500">0</text>
          
          {/* X-axis labels */}
          <text x="70" y="220" className="text-xs fill-gray-500">Jan</text>
          <text x="130" y="220" className="text-xs fill-gray-500">Feb</text>
          <text x="190" y="220" className="text-xs fill-gray-500">Mar</text>
          <text x="250" y="220" className="text-xs fill-gray-500">Apr</text>
          <text x="310" y="220" className="text-xs fill-gray-500">May</text>
          <text x="370" y="220" className="text-xs fill-gray-500">Jun</text>
          
          {/* Chart area */}
          <path
            d={generateSVGPath(data)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Fill area */}
          <path
            d={generateSVGPath(data) + ' L 370 200 L 40 200 Z'}
            fill="url(#gradient)"
            opacity="0.3"
          />
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default StudentGrowthChart;