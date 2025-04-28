import { NextResponse, NextRequest } from "next/server";
import apolloClient from "@/lib/apollo/client";
import { GET_RELEASES } from "@/graphql/queries";
import dayjs from "dayjs";
import { ApolloQueryResult } from "@apollo/client";

interface ReleaseNode {
  id: string;
  tagName: string;
  publishedAt: string | null;
  isPrerelease: boolean;
  isDraft: boolean;
}

interface ReleaseQueryData {
  repository: {
    id: string;
    releases: {
      pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
      };
      nodes: ReleaseNode[];
    } | null;
  } | null;
}

interface ReleaseCadenceData {
  averageDays: number | null;
  releaseCount: number;
  releases: { tagName: string; publishedAt: string }[]; // Last few releases
}

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ owner: string; name: string }> }
) {
  const { owner, name } = await context.params;
  const maxReleasesToAnalyze = 50; // Limit how many releases to fetch/analyze
  const maxReleasesToList = 5; // How many to show in the UI

  if (!owner || !name) {
    return NextResponse.json(
      { error: "Repository owner and name are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch releases (only need first page for recent cadence usually)
    const queryResult: ApolloQueryResult<ReleaseQueryData> = await apolloClient.query<ReleaseQueryData>({
      query: GET_RELEASES,
      variables: { owner, name, first: maxReleasesToAnalyze }, // Fetch enough for calculation
      fetchPolicy: "network-only",
    });

    const data: ReleaseQueryData | null | undefined = queryResult.data;
    const queryError = queryResult.error;

    if (queryError) throw new Error(queryError.message);

    const releases = data?.repository?.releases?.nodes || [];

    // Filter out drafts/prereleases and sort by published date (newest first)
    const validReleases = releases
      .filter(r => !r.isDraft && !r.isPrerelease && r.publishedAt)
      .sort((a, b) => dayjs(b.publishedAt!).diff(dayjs(a.publishedAt!)));

    let averageDays: number | null = null;
    if (validReleases.length >= 2) {
      let totalDiff = 0;
      for (let i = 0; i < validReleases.length - 1; i++) {
        const diff = dayjs(validReleases[i].publishedAt!).diff(
          dayjs(validReleases[i + 1].publishedAt!),
          "day"
        );
        totalDiff += diff;
      }
      averageDays = Math.round(totalDiff / (validReleases.length - 1));
    }

    const responseData: ReleaseCadenceData = {
      averageDays,
      releaseCount: validReleases.length,
      releases: validReleases
        .slice(0, maxReleasesToList)
        .map(r => ({ tagName: r.tagName, publishedAt: r.publishedAt! })),
    };

    return NextResponse.json(responseData);

  } catch (err: any) {
    console.error(`Error fetching release cadence for ${owner}/${name}:`, err);
    return NextResponse.json(
      { error: `Failed to fetch release cadence: ${err.message}` },
      { status: 500 }
    );
  }
} 