import { NextResponse, NextRequest } from "next/server";
import apolloClient from "@/lib/apollo/client"; // Use the server-side configured client
import { GET_REPOSITORY_COMMITS } from "@/graphql/queries";
import { getSession } from "next-auth/react"; // Can still use this server-side in route handlers
import { headers } from "next/headers"; // To potentially pass auth context if needed differently
import { ApolloQueryResult } from "@apollo/client";

interface CommitNode {
  id: string;
  committedDate: string;
}

// Define the expected type for the GraphQL query result
interface CommitQueryData {
  repository: {
    id: string;
    defaultBranchRef: {
      name: string;
      target: {
        // Assuming target is always a Commit based on the query structure
        id: string;
        history: {
          nodes: CommitNode[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      } | null;
    } | null;
  } | null;
}

interface HeatmapData {
  date: string; // Format: YYYY-MM-DD
  count: number;
}

// Helper to format date
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toISOString().split('T')[0];
};

export const dynamic = "force-dynamic";

// Replace with the user's provided "ultra-safe" pattern, but keep the original logic
export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; name: string } }
) {
  const { owner, name } = params;

  if (!owner || !name) {
    // Use NextResponse for consistency
    return NextResponse.json(
      { error: "Repository owner and name are required" },
      { status: 400 }
    );
  }

  try {
    const commitLimit = 100;
    const queryResult: ApolloQueryResult<CommitQueryData> = await apolloClient.query<CommitQueryData>({
      query: GET_REPOSITORY_COMMITS,
      variables: { owner, name, limit: commitLimit },
    });

    // Ensure data is declared from the query result
    const data: CommitQueryData | null | undefined = queryResult.data;

    if (queryResult.error) throw new Error(queryResult.error.message);

    const commits = data?.repository?.defaultBranchRef?.target?.history?.nodes as CommitNode[] || [];

    const activity: Record<string, number> = {};
    commits.forEach(commit => {
      const date = formatDate(commit.committedDate);
      activity[date] = (activity[date] || 0) + 1;
    });

    const heatmapData: HeatmapData[] = Object.entries(activity).map(([date, count]) => ({
      date,
      count,
    }));
    
    // Return using NextResponse
    return NextResponse.json(heatmapData);

  } catch (err: any) {
    console.error(`Error fetching commit activity for ${owner}/${name}:`, err);
    // Return using NextResponse
    return NextResponse.json(
      { error: `Failed to fetch commit activity: ${err.message}` },
      { status: 500 }
    );
  }
} 