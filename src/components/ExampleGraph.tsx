import React from 'react';
import './ExampleGraph.css';

const ExampleGraph: React.FC = () => {
  const data = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 25 },
    { label: 'Apr', value: 60 },
    { label: 'May', value: 75 },
    { label: 'Jun', value: 50 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="graph-card">
      <h3>Monthly Shipment Volume</h3>
      <div className="bar-chart">
        {data.map((item) => (
          <div key={item.label} className="bar-container">
            <div 
              className="bar" 
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            ></div>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleGraph;
