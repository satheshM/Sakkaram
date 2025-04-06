import React from 'react';

const getAnalysis = (data) => {
  const values = data.map(d => d.amount);
  const start = values[0];
  const end = values[values.length - 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const change = ((end - start) / start) * 100;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

  return {
    start,
    end,
    min,
    max,
    avg: avg.toFixed(2),
    change: change.toFixed(2),
    trend,
  };
};

const generateTicks = (min, max, step = 1000) => {
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let i = start; i <= end; i += step) {
    ticks.push(i);
  }
  return ticks;
};

const MonthlyEarningsAreaChart = ({ data }) => {
  const width = 700;
  const height = 300;
  const padding = 50;

  const values = data.map(d => d.amount);
  const maxY = Math.max(...values);
  const minY = Math.min(...values);
  const yRange = maxY - minY;

  const analysis = getAnalysis(data);
  const ticks = generateTicks(minY, maxY, 1000); // You can customize the step

  const points = values.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - minY) / yRange) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPath = `
    M ${padding},${height - padding}
    L ${points.join(' ')}
    L ${width - padding},${height - padding}
    Z
  `;

  const linePath = `M ${points.join(' L ')}`;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2 className="text-xl font-bold text-green-700 mb-4">💰 Monthly Earnings</h2>

      <div className="flex gap-6 flex-wrap text-sm text-gray-800 mb-4">
        <div><strong>Start:</strong> ₹{analysis.start}</div>
        <div><strong>End:</strong> ₹{analysis.end}</div>
        <div>
          <strong>Change:</strong>{' '}
          <span style={{ color: analysis.trend === 'up' ? 'green' : analysis.trend === 'down' ? 'red' : 'gray' }}>
            {analysis.change}% {analysis.trend === 'up' ? '📈' : analysis.trend === 'down' ? '📉' : '➖'}
          </span>
        </div>
        <div><strong>Min:</strong> ₹{analysis.min}</div>
        <div><strong>Max:</strong> ₹{analysis.max}</div>
        <div><strong>Avg:</strong> ₹{analysis.avg}</div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg width={width} height={height}>
          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />

          {/* Y-axis ticks */}
          {ticks.map((tick, i) => {
            const y = height - padding - ((tick - minY) / yRange) * (height - padding * 2);
            return (
              <g key={i}>
                <line x1={padding - 5} x2={padding} y1={y} y2={y} stroke="#666" />
                <text x={padding - 10} y={y + 4} fontSize="12" fill="#666" textAnchor="end">
                  ₹{tick}
                </text>
              </g>
            );
          })}

          {/* Area + Line */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={linePath} stroke="#16a34a" fill="none" strokeWidth="2" />

          {/* Data points + X axis labels */}
          {points.map((pt, i) => {
  const [cx, cy] = pt.split(',').map(Number);
  const amount = `₹${data[i].amount.toLocaleString()}`;

  return (
    <g key={i}>
      {/* Tooltip-style rectangle */}
      <rect
        x={cx - 30}
        y={cy - 35}
        width="60"
        height="20"
        rx="6"
        ry="6"
        fill="#fff"
        stroke="#ccc"
        strokeWidth="1"
        filter="drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
      />
      {/* Text inside tooltip */}
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="#333"
      >
        {amount}
      </text>

      {/* The green dot */}
      <circle cx={cx} cy={cy} r="3" fill="#16a34a" />

      {/* X axis month label */}
      <text x={cx} y={height - 10} textAnchor="middle" fontSize="12" fill="#666">
        {data[i].month}
      </text>
    </g>
  );
})}


        </svg>
      </div>
    </div>
  );
};

export default MonthlyEarningsAreaChart;
