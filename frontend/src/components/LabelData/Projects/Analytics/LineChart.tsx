import React from 'react';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, PointElement);

type LineChartProps = {
    labels?: string[];
    dataPoints: number[];
    dataColor: string;
    numberOfHours: number;
};

const LineChart: React.FC<LineChartProps> = ({ labels, dataPoints, dataColor, numberOfHours }) => {
    const totalDuration = 1000;
    const delayBetweenPoints = totalDuration / dataPoints.length;

    const previousY = (ctx: any) => {
        if (ctx.index === 0) return ctx.chart.scales.y.getPixelForValue(dataPoints[0]);
        return ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    };

    const animation = {
        x: {
            type: 'number' as const,
            easing: 'linear' as const,
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx: any) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number' as const,
            easing: 'linear' as const,
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx: any) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const generateLabels = (numberOfHours: number, dataPointsLength: number): string[] => {
        const labels = [];
        const totalTimeInHours = numberOfHours * dataPointsLength;
        const step = totalTimeInHours / dataPointsLength;

        for (let i = 0; i < dataPointsLength; i++) {
            const time = step * i;
            const label = `${time}hr`;
            labels.push(label);
        }

        return labels;
    };

    const data: ChartData<'line'> = {
        labels: generateLabels(numberOfHours, dataPoints.length),
        datasets: [
            {
                label: 'Data Labeled',
                data: dataPoints,
                borderColor: dataColor,
                backgroundColor: dataColor,
                borderWidth: 1,
                pointRadius: 3,
                tension: 0,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        animation: animation as any, // Type assertion needed due to complex animation object
        plugins: {
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'black',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                padding: 8,
                displayColors: false,
                callbacks: {
                    title: () => '',
                    label(context) {
                        const xLabel = context.chart.data.labels?.[context.dataIndex];
                        const yValue = context.parsed.y;
                        return `${yValue} | ${xLabel}`;
                    },
                },
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false,
                },
                ticks: {
                    display: true,
                    padding: 8,
                    maxRotation: 0,
                    minRotation: 0
                },
            },
            y: {
                grid: {
                    display: true,
                    color: 'rgba(200, 200, 200, 0.1)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    display: true,
                    padding: 8,
                },
                min: 0
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return <Line data={data} options={options} />;
};

export default LineChart;