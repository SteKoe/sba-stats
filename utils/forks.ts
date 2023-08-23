import {gql} from "@apollo/client";
import {client} from "@/utils/client";
import {Fork, Issue} from "@/global";

export async function getForks(cursor?: string): Promise<any> {
    const filter = ["first: 100"]
    if (cursor) {
        filter.push(`after: "${cursor}"`)
    }

    let literals = `
        query GetIssues {
            repository(owner: "codecentric", name: "spring-boot-admin") {
                id
                forks (${filter.join(",")}) {
                    totalCount
                    edges {
                        node {
                          id
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

export async function getAllForks(): Promise<Fork[]> {
    let issues = await getForks();
    let edges = issues.data.repository.forks.edges;
    let pageInfo = issues.data.repository.forks.pageInfo;

    let endCursor = pageInfo.endCursor;
    let hasNextPage = pageInfo.hasNextPage;

    while (hasNextPage) {
        let nextIssues = await getForks(endCursor);
        edges = [...edges, ...nextIssues.data.repository.forks.edges];
        endCursor = nextIssues.data.repository.forks.pageInfo.endCursor;
        hasNextPage = nextIssues.data.repository.forks.pageInfo.hasNextPage;
    }

    return edges.map((e: any) => e.node).filter((e: any) => e);
}
