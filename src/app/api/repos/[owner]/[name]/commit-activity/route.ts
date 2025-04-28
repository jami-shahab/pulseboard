import { NextResponse } from "next/server";
import apolloClient from "@/lib/apollo/client"; // Use the server-side configured client
import { GET_REPOSITORY_COMMITS } from "@/graphql/queries";
import { getSession } from "next-auth/react"; // Can still use this server-side in route handlers
import { headers } from "next/headers"; // To potentially pass auth context if needed differently

interface CommitNode {
  id: string;
  committedDate: string;
}

interface HeatmapData {
  date: string; // Format: YYYY-MM-DD
  count: number;
}

// Helper to format date
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toISOString().split('T')[0];
};

export async function GET(
  request: Request,
  { params }: { params: { owner: string; name: string } }
) {
  const { owner, name } = params;

  if (!owner || !name) {
    return NextResponse.json(
      { error: "Repository owner and name are required" },
      { status: 400 }
    );
  }

  // Note: We might need to adjust auth handling here if the Apollo Client's
  // getSession() doesn't work reliably in Route Handlers for *all* cases.
  // An alternative is passing the token explicitly if needed.
  // For now, relying on the global apolloClient config.

  try {
    // Fetch commits (adjust limit as needed, pagination required for full year)
    // Let's fetch more for a better initial heatmap look
    const commitLimit = 200; 
    const { data, error: queryError, loading } = await apolloClient.query({
      query: GET_REPOSITORY_COMMITS,
      variables: { owner, name, limit: commitLimit },
      // Use network-only or no-cache to ensure fresh data for the API route?
      // Depends on how often we expect this to be hit vs. GitHub rate limits.
      // Let's stick with default for now.
      // fetchPolicy: 'network-only',
    });

    if (queryError) {
      throw new Error(queryError.message);
    }

    const commits = data?.repository?.defaultBranchRef?.target?.history?.nodes as CommitNode[] || [];

    // Process commits into heatmap format
    const activity: Record<string, number> = {};
    commits.forEach(commit => {
      const date = formatDate(commit.committedDate);
      activity[date] = (activity[date] || 0) + 1;
    });

    const heatmapData: HeatmapData[] = Object.entries(activity).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json(heatmapData);

  } catch (err: any) {
    console.error(`Error fetching commit activity for ${owner}/${name}:`, err);
    return NextResponse.json(
      { error: `Failed to fetch commit activity: ${err.message}` },
      { status: 500 }
    );
  }
} 