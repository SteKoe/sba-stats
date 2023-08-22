import {gql} from "@apollo/client";
import {client} from "@/utils/client";
import {Issue} from "@/global";

export async function getIssues(cursor?: string): Promise<any> {
    const filter = ["first: 100"]
    if (cursor) {
        filter.push(`after: "${cursor}"`)
    }

    let literals = `
        query GetIssues {
            repository(owner: "codecentric", name: "spring-boot-admin") {
                id
                issues (${filter.join(",")}) {
                    totalCount
                    edges {
                        node {
                          id
                          number
                          title
                          closedAt
                          closed
                          createdAt
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

export async function getAllIssues(): Promise<Issue[]> {
    let issues = await getIssues();
    let edges = issues.data.repository.issues.edges;
    let pageInfo = issues.data.repository.issues.pageInfo;

    let endCursor = pageInfo.endCursor;
    let hasNextPage = pageInfo.hasNextPage;

    while (hasNextPage) {
        let nextIssues = await getIssues(endCursor);
        edges = [...edges, ...nextIssues.data.repository.issues.edges];
        endCursor = nextIssues.data.repository.issues.pageInfo.endCursor;
        hasNextPage = nextIssues.data.repository.issues.pageInfo.hasNextPage;
    }

    return edges.map(e => e.node).filter(e => e);
}
