import {ClosedIssuesByYearGraph} from "@/components/ClosedIssuesByYearGraph";
import {getAllIssues} from "@/utils/issues";
import {getAllPrs} from "@/utils/prs";
import {getAllStars} from "@/utils/stars";
import {SumGraph} from "@/components/SumGraph";
import {getAllForks} from "@/utils/forks";
import {IssuesStats} from "@/components/IssuesStats";

export default async function Home() {
    const issues = await getAllIssues()
    const prs = await getAllPrs()
    const stars = await getAllStars()
    const forks = await getAllForks()

    return (
        <div className="grid grid-cols-2">
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Closed Issues by year</h3>
                <ClosedIssuesByYearGraph
                    issues={issues.filter(i => i.closed)}
                    stars={stars}
                    prs={prs.filter(i => i.closed)}/>
            </div>
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Issue stats</h3>
                <IssuesStats issues={issues}/>
            </div>
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Stargazers</h3>
                <SumGraph items={stars}/>
            </div>
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Forks</h3>
                <SumGraph items={forks}/>
            </div>
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">Issues</h3>
                <SumGraph items={issues}/>
            </div>
            <div className="border rounded-xl shadow-xl bg-white m-2 p-4">
                <h3 className="text-center">PRs (no bots)</h3>
                <SumGraph items={prs.filter(value => !["renovate", "dependabot"].includes(value.author?.login))}/>
            </div>
        </div>
    )
}
