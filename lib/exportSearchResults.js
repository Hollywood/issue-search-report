/* eslint-disable */
"use strict";
let { graphql } = require("@octokit/graphql");

module.exports = async function exportIssues(searchCriteria, after) {
  graphql = graphql.defaults({
    method: "POST",
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });

  const query = `query findFeedbackTrail($searchCriteria: String!, $after: String) {
      search(first: 10, type: ISSUE, query: $searchCriteria, after: $after) {
        edges {
          node {
            __typename
            ... on Issue {
              number
              title
              repository {
                name
              }
              timelineItems(first: 100, itemTypes: CROSS_REFERENCED_EVENT) {
                nodes {
                  ... on CrossReferencedEvent {
                    source {
                      __typename
                      # Show any PRs associated with the Issue
                      ... on PullRequest {
                        title
                        number
                        files(first: 100) {
                          nodes {
                            path
                          }
                        }
                      }
                      # Show any Issues referencing the returned Issue
                      ... on Issue {
                        title
                        number
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;

  const issueEntries = [];
  let currentPageCursor = "";
  let queryResults = { issueEntries, currentPageCursor };

  async function getIssueEntries(searchCriteria, after) {
    const result = await graphql(query, { searchCriteria, after });
    const { edges, pageInfo } = result.search;

    edges.forEach(edge => {
      issueEntries.push(edge.node);
    });

    if (pageInfo.hasNextPage) {
      return getIssueEntries(searchCriteria, pageInfo.endCursor);
    }

    if (!pageInfo.hasNextPage) {
      queryResults.currentPageCursor = pageInfo.endCursor;
    }

    console.log(pageInfo.endCursor);
    return queryResults;
  }

  return getIssueEntries(searchCriteria);
};
