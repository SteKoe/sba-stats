'use client';

import React from 'react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale, LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Chart} from 'react-chartjs-2';
import {Fork, Issue, PullRequest, Star} from "@/global";
import {groupByFullYear} from "@/utils/math";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
};

type Props = {
    items: any[]
}

export function SumGraph({items}: Props) {
    const grouped = groupByFullYear<any>(items, "createdAt");
    const sum = Object.keys(grouped)
        .map((key, index, array) => {
            let sum = grouped[key].length;
            
            for(let i = 0; i <= index; i++) {
                sum += grouped[array[i]].length
            }
            
            return sum;
        })

    const data = {
        labels: Object.keys(grouped),
        datasets: [
            {
                type: 'line' as const,
                label: 'Per year',
                data: Object.keys(grouped).map((key) => grouped[key].length),
                backgroundColor: 'rgba(255,229,99,0.5)',
            },
            {
                type: 'bar' as const,
                label: 'Sum',
                data: sum,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <Chart type="bar" options={options} data={data}/>;
}

