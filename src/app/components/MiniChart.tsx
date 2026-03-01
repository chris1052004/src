import { useState } from 'react';
import { motion } from 'motion/react';

interface MiniChartProps {
  data: number[];
  labels?: string[];
  color?: string;
}

export function MiniBarChart({ data, labels, color = '#3B82F6' }: MiniChartProps) {
  const max = Math.max(...data);
  const chartHeight = 80;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-20">
        {data.map((value, index) => {
          const height = (value / max) * chartHeight;
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setHoveredIndex(null)}
            >
              <div className="w-full flex items-end justify-center relative" style={{ height: chartHeight }}>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-5 text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded-md shadow-sm z-10"
                  >
                    {value}
                  </motion.div>
                )}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}px` }}
                  transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                  className="w-full rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: color,
                    opacity: isHovered ? 1 : 0.7,
                    transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
                  }}
                />
              </div>
              {labels && labels[index] && (
                <span className={`text-[10px] transition-colors ${isHovered ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MiniLineChart({ data, color = '#3B82F6' }: MiniChartProps) {
  const max = Math.max(...data);
  const chartHeight = 60;
  const chartWidth = 200;
  const stepX = chartWidth / (data.length - 1);

  const points = data
    .map((value, index) => {
      const x = index * stepX;
      const y = chartHeight - (value / max) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-16">
        <line
          x1="0"
          y1={chartHeight / 2}
          x2={chartWidth}
          y2={chartHeight / 2}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />
        
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <polyline
          points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
          fill={color}
          opacity="0.08"
        />
        
        {data.map((value, index) => {
          const x = index * stepX;
          const y = chartHeight - (value / max) * chartHeight;
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            />
          );
        })}
      </svg>
    </div>
  );
}
