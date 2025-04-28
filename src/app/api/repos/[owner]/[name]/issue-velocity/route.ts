import { NextResponse } from "next/server";
import apolloClient from "@/lib/apollo/client";
import { GET_ISSUES_FOR_VELOCITY } from "@/graphql/queries";
import dayjs from "dayjs"; // Using dayjs for easier date manipulation
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek"; // Use isoWeek for consistency
import { ApolloQueryResult } from "@apollo/client"; // Import ApolloQueryResult
import { NextRequest } from "next/server";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

interface IssueNode {
  id: string;
  createdAt: string;
  closedAt: string | null;
  state: "OPEN" | "CLOSED";
}

interface WeeklyVelocity {
  weekStartDate: string; // YYYY-MM-DD format, start of the ISO week (Monday)
  opened: number;
  closed: number;
}

interface IssuesQueryData {
  repository: {
    id: string;
    createdIssues: {
      totalCount: number;
      pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
      };
      nodes: IssueNode[];
    } | null;
  } | null;
}

// Function to get the start date of the ISO week (Monday)
const getWeekStartDate = (date: dayjs.Dayjs): string => {
  return date.isoWeekday(1).format("YYYY-MM-DD");
};

export const dynamic = "force-dynamic"; // Ensure dynamic execution

// Updated signature for async params in Next.js 15
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ owner: string; name: string }> }
) {
  const { owner, name } = await context.params; // Await params
  const periodDays = 90; // Look at the last 90 days

  if (!owner || !name) {
    return NextResponse.json(
      { error: "Repository owner and name are required" },
      { status: 400 }
    );
  }

  try {
    const sinceDate = dayjs().subtract(periodDays, "day").toISOString();
    let allIssues: IssueNode[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    // Basic pagination loop (might need refinement for very large repos)
    while (hasNextPage) {
      const queryResult: ApolloQueryResult<IssuesQueryData> = await apolloClient.query<IssuesQueryData>({
        query: GET_ISSUES_FOR_VELOCITY,
        variables: { owner, name, since: sinceDate, first: 100, cursor },
        fetchPolicy: "network-only",
      });

      const data: IssuesQueryData | null | undefined = queryResult.data;
      const queryError = queryResult.error;

      if (queryError) throw new Error(queryError.message);

      const issuesData = data?.repository?.createdIssues;
      if (!issuesData?.nodes) break; // Exit if no data

      allIssues = allIssues.concat(issuesData.nodes);
      hasNextPage = issuesData.pageInfo.hasNextPage;
      cursor = issuesData.pageInfo.endCursor;

      // Safety break - avoid potential infinite loops in case of API issues
      if (allIssues.length > 1000 || !hasNextPage) { 
        // Limit to processing ~1000 issues for performance/rate limit reasons
        // Or if there are no more pages
        break;
      } 
    }

    // Process issues into weekly buckets
    const weeklyData: Record<string, { opened: number; closed: number }> = {};

    allIssues.forEach((issue) => {
      const createdAt = dayjs(issue.createdAt);
      const weekStartCreated = getWeekStartDate(createdAt);

      if (!weeklyData[weekStartCreated]) {
        weeklyData[weekStartCreated] = { opened: 0, closed: 0 };
      }
      weeklyData[weekStartCreated].opened++;

      if (issue.state === "CLOSED" && issue.closedAt) {
        const closedAt = dayjs(issue.closedAt);
        // Ensure the issue was also closed within our period 
        if (closedAt.isAfter(dayjs(sinceDate))) { 
          const weekStartClosed = getWeekStartDate(closedAt);
          if (!weeklyData[weekStartClosed]) {
            weeklyData[weekStartClosed] = { opened: 0, closed: 0 };
          }
          weeklyData[weekStartClosed].closed++;
        } 
      }
    });

    // Convert to array and sort by week start date
    const velocityData: WeeklyVelocity[] = Object.entries(weeklyData)
      .map(([weekStartDate, counts]) => ({
        weekStartDate,
        ...counts,
      }))
      .sort((a, b) => a.weekStartDate.localeCompare(b.weekStartDate));

    return NextResponse.json(velocityData);

  } catch (err: any) {
    console.error(`Error fetching issue velocity for ${owner}/${name}:`, err);
    return NextResponse.json(
      { error: `Failed to fetch issue velocity: ${err.message}` },
      { status: 500 }
    );
  }
} 