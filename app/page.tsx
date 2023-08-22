import {ClosedIssuesByYearGraph} from "@/components/ClosedIssuesByYearGraph";
import {getAllIssues} from "@/utils/issues";
import {IssuesStats} from "@/components/IssuesStats";
import {getAllPrs} from "@/utils/prs";

export default async function Home() {
    const issues = await getAllIssues()
    const prs = await getAllPrs()

    return (
        <div className="grid grid-cols-2">
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Closed Issues by year</h3>
                <ClosedIssuesByYearGraph issues={issues.filter(i => i.closed)} prs={prs.filter(i => i.closed)}/>
            </div>
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Issues</h3>
                <IssuesStats issues={issues} />
            </div>
        </div>
    )
}
