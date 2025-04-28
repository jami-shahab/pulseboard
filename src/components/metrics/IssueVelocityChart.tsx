"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs"; // For formatting axis labels

interface IssueVelocityProps {
  repoOwner: string;
  repoName: string;
}

interface WeeklyVelocityData {
  weekStartDate: string; // YYYY-MM-DD format
  opened: number;
  closed: number;
}

// Format date for X-axis tick
const formatXAxisTick = (tickItem: string) => {
  return dayjs(tickItem).format("MMM D"); // e.g., Jan 15
};

export default function IssueVelocityChart({ repoOwner, repoName }: IssueVelocityProps) {
  const [data, setData] = useState<WeeklyVelocityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/repos/${repoOwner}/${repoName}/issue-velocity`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const result: WeeklyVelocityData[] = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch issue velocity data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repoOwner, repoName]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Issue Velocity (Last 90 Days)
      </h3>
      {loading && (
        <div className="h-64 animate-pulse bg-neutral-200 rounded-md"></div> // Simple pulse loader
      )}
      {error && (
         <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
           <p className="text-sm font-medium text-secondary-dark">Error Loading Chart</p>
           <p className="text-sm text-secondary-dark mt-1">{error}</p>
         </div>
      )}
      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 0, // Adjusted left margin
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="weekStartDate" 
              tickFormatter={formatXAxisTick} 
              tick={{ fontSize: 12, fill: '#6b7280' }} // Tailwind gray-500
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              axisLine={false} 
              tickLine={false} 
              allowDecimals={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(44, 50, 66, 0.9)', // neutral-900 with opacity
                borderColor: '#2c3242', // neutral-900
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '12px',
                padding: '8px 12px'
              }} 
              cursor={{ fill: 'rgba(209, 213, 219, 0.3)' }} // gray-300 with opacity
              itemStyle={{ color: '#ffffff'}}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconSize={10} 
              wrapperStyle={{ fontSize: '12px', color: '#374151' /* gray-700 */ }}
            />
            {/* Use theme colors */}
            <Bar dataKey="opened" fill="#6e5ff1" name="Opened" radius={[4, 4, 0, 0]} /> 
            <Bar dataKey="closed" fill="#ff6b6b" name="Closed" radius={[4, 4, 0, 0]} /> 
          </BarChart>
        </ResponsiveContainer>
      )}
      {!loading && !error && data.length === 0 && (
        <p className="text-neutral-500 text-center py-10">No recent issue activity found.</p>
      )}
    </div>
  );
} 