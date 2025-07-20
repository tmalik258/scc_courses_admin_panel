"use client";

import React, { useState } from "react";
import { ChartDataPoint } from "@/types/student";

interface StudentGrowthChartProps {
  data: ChartDataPoint[];
}

const StudentGrowthChart: React.FC<StudentGrowthChartProps> = ({ data }) => {
  const width = 400;
  const height = 200;
  const padding = 40;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const xScale = (width - 2 * padding) / (data.length - 1);
  const yMax = Math.max(...data.map((d) => d.value), 1);
  const yScale = (height - 2 * padding) / yMax;

  const getCoordinates = (value: number, index: number) => {
    const x = padding + index * xScale;
    const y = height - padding - value * yScale;
    return { x, y };
  };

  const pathD = data
    .map((point, i) => {
      const { x, y } = getCoordinates(point.value, i);
      return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
    })
    .join(" ");

  const fillPath = `${pathD} L ${padding + (data.length - 1) * xScale},${
    height - padding
  } L ${padding},${height - padding} Z`;

  return (
    <div className="relative lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Total Student Growth
      </h2>
      <div className="h-64 relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis Labels */}
          {[0, 0.33, 0.66, 1].map((f, i) => {
            const y = padding + (1 - f) * (height - 2 * padding);
            return (
              <text
                key={i}
                x={8}
                y={y + 4}
                className="text-[10px] fill-gray-500"
              >
                {Math.round(yMax * f)}
              </text>
            );
          })}

          {/* X-axis Labels */}
          {data.map((point, i) => {
            const { x } = getCoordinates(0, i);
            return (
              <text
                key={i}
                x={x - 10}
                y={height - 5}
                className="text-[10px] fill-gray-500"
              >
                {point.label}
              </text>
            );
          })}

          {/* Fill under line */}
          <path d={fillPath} fill="url(#gradient)" opacity="0.3" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Main line */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {/* Hover interaction zone */}
          {data.map((point, i) => {
            const { x } = getCoordinates(0, i);
            return (
              <rect
                key={i}
                x={x - xScale / 2}
                y={0}
                width={xScale}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}

          {/* Tooltip */}
          {hoverIndex !== null &&
            (() => {
              const { x, y } = getCoordinates(
                data[hoverIndex].value,
                hoverIndex
              );
              return (
                <>
                  <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                  <rect
                    x={x - 20}
                    y={y - 35}
                    width="40"
                    height="20"
                    rx="4"
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                  />
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    className="text-[10px] fill-gray-800"
                  >
                    {data[hoverIndex].value}
                  </text>
                </>
              );
            })()}
        </svg>
      </div>
    </div>
  );
};

export default StudentGrowthChart;
