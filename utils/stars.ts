import {gql} from "@apollo/client";
import {client} from "@/utils/client";
import {Issue, Star} from "@/global";

export async function getStars(cursor?: string): Promise<any> {
    const filter = ["first: 100"]
    if (cursor) {
        filter.push(`after: "${cursor}"`)
    }

    let literals = `
        query GetStars {
            repository(owner: "codecentric", name: "spring-boot-admin") {
                id
                stargazers (${filter.join(",")}) {
                    totalCount
                    edges {
                        node {
                          id
                          createdAt
                          updatedAt
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

export async function getAllStars(): Promise<Star[]> {
    let response = await getStars();
    let edges = response.data.repository.stargazers.edges;
    let pageInfo = response.data.repository.stargazers.pageInfo;

    let endCursor = pageInfo.endCursor;
    let hasNextPage = pageInfo.hasNextPage;

    while (hasNextPage) {
        let nextIssues = await getStars(endCursor);
        edges = [...edges, ...nextIssues.data.repository.stargazers.edges];
        endCursor = nextIssues.data.repository.stargazers.pageInfo.endCursor;
        hasNextPage = nextIssues.data.repository.stargazers.pageInfo.hasNextPage;
    }

    return edges.map((e: any) => e.node).filter((e: any) => e);
}
