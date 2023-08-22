'use client';

import React, {PropsWithChildren} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {faker} from "@faker-js/faker";
import {Issue, PullRequest} from "@/global";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
}

const bots = ["renovate", "dependabot"];

export function ClosedIssuesByYearGraph({ issues, prs } : Props) {
    const groupedIssues = grouByFullYear(issues);
    const groupedPullRequestsWithoutBots = grouByFullYear(prs);
    
    const data = {
        labels: Object.keys({...groupedIssues, ...groupedPullRequestsWithoutBots}),
        datasets: [
            {
                label: 'Issues closed by year',
                data: Object.keys(groupedIssues).map((key) => groupedIssues[key].length),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'PRs closed (users)',
                data: Object.keys(groupedPullRequestsWithoutBots).map((key) => groupedPullRequestsWithoutBots[key].filter(p => !bots.includes((p as PullRequest).author?.login)).length),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'PRs closed (bots)',
                data: Object.keys(groupedPullRequestsWithoutBots).map((key) => {
                    return groupedPullRequestsWithoutBots[key].filter(p => bots.includes((p as PullRequest).author?.login)).length;
                }),
                backgroundColor: 'rgba(147,235,53,0.5)',
            }
        ],
    };
    
    return <Bar options={options} data={data} />;
}

function grouByFullYear(items: (Issue | PullRequest)[]) : { [key: string]: Issue[] | PullRequest[] } {
    return items.reduce((grouped, product) => {
        let group = new Date(product.closedAt).getFullYear();
        if(!grouped[group]) {
            grouped[group] = [];
        }

        grouped[group].push(product);

        return grouped;
    }, {} as { [key: string]: (Issue | PullRequest)[] })
}