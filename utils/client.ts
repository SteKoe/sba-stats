import {ApolloClient, InMemoryCache} from "@apollo/client";

const cache = new InMemoryCache({
    typePolicies: {
        Repository: {
            fields: {
                issues: {
                    merge(existing, incoming, {mergeObjects}) {
                        return mergeObjects(existing, incoming);
                    },
                },
            },
        },
    },
});

export const client = new ApolloClient({
    cache: cache,
    uri: 'https://api.github.com/graphql',
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    },
    name: 'react-web-client',
    queryDeduplication: false,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});