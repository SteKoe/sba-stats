import {Interval} from "luxon";

type Star = {
    id: string,
    createdAt: string
}

type Fork = {
    id: string,
    createdAt: string
}

type Issue = {
    number: string,
    closed: boolean,
    createdAt: string,
    closedAt: string,
}

type IssueWithDuration = {
    createdAt: Date,
    closedAt: Date,
    durationToResolve: Interval
} & Issue

type PullRequest = {
    author: {
        login: string
    }
} & Issue

type PullRequestWithDuration = IssueWithDuration