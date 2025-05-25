import React from 'react';

interface GaugeProps {
    percentage: number;
    className?: string;
}

const CustomGauge: React.FC<GaugeProps> = ({ percentage, className = '' }) => {
    // Constants for the gauge
    const CENTER = 50;
    const RADIUS = 40;
    const STROKE_WIDTH = 12;
    const STROKE_WIDTH_REMAINING = 6;
    
    // Calculate the 270-degree arc path
    const calculateArc = (radius: number) => {
        // Start at -225 degrees (135 degrees rotated from straight left)
        // End at 45 degrees for a total sweep of 270 degrees
        const startAngle = -225;
        const endAngle = 45;
        
        const start = {
            x: CENTER + radius * Math.cos((startAngle * Math.PI) / 180),
            y: CENTER + radius * Math.sin((startAngle * Math.PI) / 180)
        };
        
        const end = {
            x: CENTER + radius * Math.cos((endAngle * Math.PI) / 180),
            y: CENTER + radius * Math.sin((endAngle * Math.PI) / 180)
        };
        
        // Large arc flag is 1 for angles > 180 degrees
        const largeArcFlag = 1;
        
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };

    // Arc paths
    const arc = calculateArc(RADIUS);
    
    // Calculate the total arc length for the 270-degree sweep
    const arcLength = (RADIUS * Math.PI * 3) / 2; // 270/360 * 2πr
    
    return (
        <div className={className}>
            <svg
                viewBox="0 0 100 100"
                className="w-full"
            >
                {/* Background Arc (Gray) */}
                <path
                    d={arc}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={STROKE_WIDTH_REMAINING}
                    strokeLinecap="round"
                />

                {/* Foreground Arc (Red - Progress) */}
                <path
                    d={arc}
                    fill="none"
                    stroke="#FF0000"
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={arcLength * (1 - percentage / 100)}
                    className="transition-all duration-500 ease-in-out"
                />

                {/* Percentage Text */}
                <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-2xl font-bold"
                    style={{ fontSize: '16px' }}
                >
                    {`${Math.round(percentage)}%`}
                </text>
            </svg>
        </div>
    );
};

export default CustomGauge;