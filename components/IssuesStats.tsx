import {Duration, Interval} from "luxon";
import {Issue, IssueWithDuration} from "@/global";
import {median} from "@/utils/math";

type Props = {
    issues: Issue[]
}


export function IssuesStats({issues}: Props) {

    const closedIssues = issues.filter(i => i.closed).map(issue => ({
        ...issue,
        createdAt: new Date(issue.createdAt),
        closedAt: new Date(issue.closedAt),
        durationToResolve: Interval.fromDateTimes(new Date(issue.createdAt), new Date(issue.closedAt))
    } as IssueWithDuration))


    let sortedIssuesByTimeToResolve = closedIssues.sort((a, b) => {
        return b.durationToResolve.toDuration(['milliseconds']).milliseconds - a.durationToResolve.toDuration(['milliseconds']).milliseconds
    });
    const ticketMaxTimeToResolve = sortedIssuesByTimeToResolve[0];
    const maxDurationToResolve = ticketMaxTimeToResolve?.durationToResolve.toDuration(['days', 'hours', 'minutes']).toHuman()

    const ticketMinTimeToResolve = sortedIssuesByTimeToResolve[sortedIssuesByTimeToResolve.length - 1];
    const minDurationToResolve = ticketMinTimeToResolve?.durationToResolve.toDuration(['days', 'hours', 'minutes']).toHuman()

    const medianTimeToResolve = median(closedIssues.map(i => i.durationToResolve.toDuration(['milliseconds']).milliseconds))!;

    return (
        <dl className="grid grid-cols-6">
            <dt className="col-span-2 font-bold">Total</dt>
            <dd className="col-span-4 font-mono">{issues.length}</dd>

            <dt className="col-span-2 font-bold">Open</dt>
            <dd className="col-span-4 font-mono">{issues.filter(i => !i.closed).length}</dd>

            <dt className="col-span-2 font-bold">Closed</dt>
            <dd className="col-span-4 font-mono">{issues.filter(i => i.closed).length}</dd>

            <dt className="col-span-2 font-bold">Time to close (median)</dt>
            <dd className="col-span-4 font-mono">{Duration.fromMillis(medianTimeToResolve).toFormat("d 'days', h 'hours', m 'minutes'")}</dd>

            <dt className="col-span-2 font-bold">Time to close (slowest)</dt>
            <dd className="col-span-4 font-mono">
                #{ticketMaxTimeToResolve.number}<br/>
                {maxDurationToResolve}
            </dd>

            <dt className="col-span-2 font-bold">Time to close (fastest)</dt>
            <dd className="col-span-4 font-mono">
                #{ticketMinTimeToResolve.number}<br/>
                {minDurationToResolve}
            </dd>
        </dl>
    )
}