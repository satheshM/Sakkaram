import React from 'react';

const VehiclePerformanceSplitChart = ({ data }) => {
  const chartHeight = 250;
  const chartWidth = 600;
  const padding = 50;
  const barWidth = 30;
  const groupSpacing = 70;

  const maxEarnings = Math.max(...data.map(d => d.earnings));
  const maxBookings = Math.max(...data.map(d => d.bookings));

  const scaleY = (value, maxY) =>
    chartHeight - padding - (value / maxY) * (chartHeight - padding * 2);

  return (
    <div className="p-6 font-sans text-sm">
      <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
        🚜 Vehicle Performance
      </h2>

      <div className="flex flex-wrap gap-6 overflow-x-auto">
        {/* Earnings Chart */}
        <div>
          <h3 className="text-green-700 font-semibold mb-2 text-lg">Earnings</h3>
          <svg width={chartWidth} height={chartHeight}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = chartHeight - padding - t * (chartHeight - padding * 2);
              const value = Math.round(t * maxEarnings);
              return (
                <g key={i}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                  />
                  <text
                    x={padding - 10}
                    y={y}
                    fontSize="12"
                    textAnchor="end"
                    fill="#555"
                  >
                    ₹{value}
                  </text>
                </g>
              );
            })}

            {data.map((veh, index) => {
              const baseX = padding + index * groupSpacing+50;
              const y = scaleY(veh.earnings, maxEarnings);
              const barHeight = chartHeight - padding - y;

              return (
                <g key={veh.id}>
                  <rect
                    x={baseX}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#16a34a"
                    rx={3}
                  />
                  <text
                    x={baseX + barWidth / 2}
                    y={y - 5}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#000"
                  >
                    ₹{veh.earnings}
                  </text>
                  <text
                    x={baseX + barWidth / 2}
                    y={chartHeight - padding + 18}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#555"
                  >
                    {veh.name}
                  </text>
                </g>
              );
            })}

            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#999"
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#999"
            />
          </svg>
        </div>

        {/* Bookings Chart */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-2 text-lg">Bookings</h3>
          <svg width={chartWidth} height={chartHeight}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = chartHeight - padding - t * (chartHeight - padding * 2);
              const value = Math.round(t * maxBookings);
              return (
                <g key={i}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                  />
                  <text
                    x={padding - 10}
                    y={y}
                    fontSize="12"
                    textAnchor="end"
                    fill="#555"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {data.map((veh, index) => {
              const baseX = padding + index * groupSpacing+50;
              const y = scaleY(veh.bookings, maxBookings);
              const barHeight = chartHeight - padding - y;

              return (
                <g key={veh.id}>
                  <rect
                    x={baseX}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#3b82f6"
                    rx={3}
                  />
                  <text
                    x={baseX + barWidth / 2}
                    y={y - 5}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#000"
                  >
                    {veh.bookings}
                  </text>
                  <text
                    x={baseX + barWidth / 2}
                    y={chartHeight - padding + 18}
                    fontSize="12"
                    textAnchor="middle"
                    fill="#555"
                  >
                    {veh.name}
                  </text>
                </g>
              );
            })}

            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#999"
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#999"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default VehiclePerformanceSplitChart;
