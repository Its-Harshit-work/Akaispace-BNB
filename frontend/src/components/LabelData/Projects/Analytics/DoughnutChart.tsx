'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    Plugin,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for the chart data and options
type DoughnutChartData = ChartData<'doughnut', number[], string>;
type DoughnutChartOptions = ChartOptions<'doughnut'>;

interface DoughnutChartProps {
    className: string;
    data: DoughnutChartData;
    centerText?: string; // Text to display in the center
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ className, data, centerText }) => {

    const options: DoughnutChartOptions = {
        cutout: '70%', // Controls the thickness of the doughnut
        responsive: true,
        circumference: 270, // Sets the arc to cover 270 degrees (partial circle)
        rotation: -135, // Rotates the chart starting from the top (clockwise)
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#FFF', // Adjusts legend text color
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return ` ${label}: ${value}%`;
                    },
                },
            },
        },
    };

    // Custom plugin to render text in the center
    const centerTextPlugin: Plugin<'doughnut'> = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { width } = chart;
            const { height } = chart;
            const ctx = chart.ctx;
            const fontSize = Math.min(width / 10, 20); // Dynamically adjust font size

            ctx.save();
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = '#FFF'; // Text color
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Calculate center position
            const x = width / 2;
            const y = height / 2;

            // Draw the text
            if (centerText) {
                ctx.fillText(centerText + "%", x, y);
                ctx.restore();
            }
        },
    };

    return (
        <div className={`${className}`}>
            <Doughnut
                className=""
                data={data}
                options={options}

                plugins={[centerTextPlugin]} // Add custom plugin
            />
        </div>
    );
};

export default DoughnutChart;
