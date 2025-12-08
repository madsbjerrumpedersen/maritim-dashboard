import React, { useState } from 'react';
import { type VoyageSummary } from '../utils/routePhysics';
import { type ShipProfile } from '../data/ships';

interface OptimizationStatsProps {
  currentVoyage: VoyageSummary;
  baselineVoyage: VoyageSummary;
  shipProfile: ShipProfile;
}

const OptimizationStats: React.FC<OptimizationStatsProps> = ({ currentVoyage, baselineVoyage, shipProfile }) => {
  // Defaults
  const [fuelPrice, setFuelPrice] = useState<number>(650); // $/ton
  const [charterRate, setCharterRate] = useState<number>(25000); // $/day

  // Calculate Deltas
  const timeDiffHours = currentVoyage.totalTimeHours - baselineVoyage.totalTimeHours;
  const timeDiffDays = timeDiffHours / 24;
  
  // CO2 and Fuel
  // We have totalCo2Kg. Fuel = CO2 / factor.
  // shipProfile.co2Factor (e.g. 3.114 for HFO)
  const co2DiffKg = baselineVoyage.totalCo2Kg - currentVoyage.totalCo2Kg; // Positive = Saving
  const co2DiffTons = co2DiffKg / 1000;
  
  const fuelDiffKg = co2DiffKg / shipProfile.co2Factor;
  const fuelDiffTons = fuelDiffKg / 1000;

  // Economics
  const fuelSavings = fuelDiffTons * fuelPrice;
  const timeCost = timeDiffDays * charterRate;
  const netBenefit = fuelSavings - timeCost;

  return (
    <div style={{ 
        marginTop: '1.5rem', 
        padding: '1.5rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
    }}>
        <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-dark)' }}>Økonomisk Konsekvensberegning</h4>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Brændstofpris ($/ton)</label>
                <input 
                    type="number" 
                    value={fuelPrice} 
                    onChange={(e) => setFuelPrice(Number(e.target.value))}
                    style={{ 
                        padding: '6px 10px', 
                        borderRadius: '4px', 
                        border: '1px solid var(--border-color)',
                        width: '120px'
                    }} 
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Charter Rate ($/dag)</label>
                <input 
                    type="number" 
                    value={charterRate} 
                    onChange={(e) => setCharterRate(Number(e.target.value))}
                    style={{ 
                        padding: '6px 10px', 
                        borderRadius: '4px', 
                        border: '1px solid var(--border-color)',
                        width: '120px'
                    }} 
                />
            </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            
            {/* Fuel Saving */}
            <div className="stat-card" style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Brændstof Besparelse</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2f9e44' }}>
                    {fuelDiffTons.toFixed(1)} tons
                </div>
                <div style={{ fontSize: '0.9rem', color: '#2f9e44' }}>
                    + ${Math.round(fuelSavings).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    CO2 Reduktion: {co2DiffTons.toFixed(1)} tons
                </div>
            </div>

            {/* Time Impact */}
            <div className="stat-card" style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tidsforøgelse</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: timeDiffHours > 0 ? '#e03131' : 'var(--text-dark)' }}>
                    +{timeDiffHours.toFixed(1)} timer
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e03131' }}>
                    - ${Math.round(timeCost).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    ({timeDiffDays.toFixed(1)} dage)
                </div>
            </div>

            {/* Net Result */}
            <div className="stat-card" style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Netto Gevinst</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: netBenefit >= 0 ? '#2f9e44' : '#e03131' }}>
                    {netBenefit >= 0 ? '+' : ''}${Math.round(netBenefit).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    {netBenefit >= 0 ? 'Økonomisk fordelagtigt' : 'Økonomisk tab'}
                </div>
            </div>

        </div>
    </div>
  );
};

export default OptimizationStats;