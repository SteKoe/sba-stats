import {gql} from "@apollo/client";
import {client} from "@/utils/client";
import {Issue, PullRequest} from "@/global";

export async function getPrs(cursor?: string): Promise<any> {
    const filter = ["first: 100"]
    if (cursor) {
        filter.push(`after: "${cursor}"`)
    }

    let literals = `
        query GetPrs {
          repository(owner: "codecentric", name: "spring-boot-admin") {
            id
            pullRequests(${filter.join(",")}) {
              totalCount
              edges {
                node {
                  id
                  number
                  title
                  closedAt
                  closed
                  createdAt
                  author {
                    login
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
    `;

    try {
        return await client.query({
            query: gql(literals)
        });
    } catch (e) {
        console.error(e)
    }

    return [];
}

export async function getAllPrs(): Promise<PullRequest[]> {
    let issues = await getPrs();
    let edges = issues.data.repository.pullRequests.edges;
    let pageInfo = issues.data.repository.pullRequests.pageInfo;

    let endCursor = pageInfo.endCursor;
    let hasNextPage = pageInfo.hasNextPage;

    while (hasNextPage) {
        let nextIssues = await getPrs(endCursor);
        edges = [...edges, ...nextIssues.data.repository.pullRequests.edges];
        endCursor = nextIssues.data.repository.pullRequests.pageInfo.endCursor;
        hasNextPage = nextIssues.data.repository.pullRequests.pageInfo.hasNextPage;
    }

    return edges.map(e => e.node).filter(e => e);
}
