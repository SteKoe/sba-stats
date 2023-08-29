'use client';

import React from 'react';
import {
    BarController,
    BarElement,
    LineController,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale, LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Chart} from 'react-chartjs-2';
import {Issue, PullRequest, Star} from "@/global";
import {groupByFullYear} from "@/utils/math";

ChartJS.register(    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
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
    issues: Issue[],
    prs: PullRequest[],
    stars: Star[]
}

const bots = ["renovate", "dependabot"];

export function ClosedIssuesByYearGraph({issues, prs, stars}: Props) {
    const groupedIssues = groupByFullYear<Issue>(issues);
    const groupedPullRequestsWithoutBots = groupByFullYear<PullRequest>(prs);

    const data = {
        labels: Object.keys({...groupedIssues, ...groupedPullRequestsWithoutBots}),
        datasets: [
            {
                type: 'bar' as const,
                label: 'Issues closed by year',
                data: Object.keys(groupedIssues).map((key) => groupedIssues[key].length),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                type: 'bar' as const,
                label: 'PRs closed (users)',
                data: Object.keys(groupedPullRequestsWithoutBots).map((key) => groupedPullRequestsWithoutBots[key].filter(p => !bots.includes(p.author?.login)).length),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                type: 'bar' as const,
                label: 'PRs closed (bots)',
                data: Object.keys(groupedPullRequestsWithoutBots).map((key) => {
                    return groupedPullRequestsWithoutBots[key].filter(p => bots.includes(p.author?.login)).length;
                }),
                backgroundColor: 'rgba(147,235,53,0.5)',
            }
        ],
    };

    return <Chart type="bar" options={options} data={data}/>;
}

