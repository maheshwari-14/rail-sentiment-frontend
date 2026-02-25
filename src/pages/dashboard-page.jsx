import { BarChart2, Database, Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "../components/layout";

export default function DashboardPage() {
  const [dashboardData] = useState(() => {
    // Load the analyzed data from localStorage synchronously on mount
    const savedData = localStorage.getItem("sentimentData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const analysis = parsed.analysis;

        let totalPos = 0,
          totalNeg = 0,
          totalNeu = 0,
          totalAll = 0;

        const formattedData = Object.keys(analysis).map((key) => {
          const cat = analysis[key];
          totalPos += cat.Positive;
          totalNeg += cat.Negative;
          totalNeu += cat.Neutral;
          totalAll += cat.Positive + cat.Negative + cat.Neutral;

          return {
            name: key,
            Positive: cat.Positive,
            Neutral: cat.Neutral,
            Negative: cat.Negative,
          };
        });

        return {
          datasetName: parsed.dataset || "Analyzed Dataset",
          categoryData: formattedData,
          totals: {
            pos: totalPos,
            neg: totalNeg,
            neu: totalNeu,
            all: totalAll,
          },
        };
      } catch (e) {
        console.error("Error parsing sentimentData from localStorage:", e);
      }
    }
    return {
      datasetName: "No dataset loaded",
      categoryData: [],
      totals: { pos: 0, neg: 0, neu: 0, all: 0 },
    };
  });

  const calculatePercentage = (value) => {
    if (dashboardData.totals.all === 0) return "0.0%";
    return ((value / dashboardData.totals.all) * 100).toFixed(1) + "%";
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Sentiment Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Analyze Indian Railway tweet sentiments using Protégé-based
            knowledge system
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
            <Database className="w-4 h-4 mr-2" /> {dashboardData.datasetName} (
            {dashboardData.totals.all} tweets)
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Positive</p>
              <h3 className="text-3xl font-bold text-green-500">
                {dashboardData.totals.pos}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {calculatePercentage(dashboardData.totals.pos)}
              </p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-200" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Negative</p>
              <h3 className="text-3xl font-bold text-red-500">
                {dashboardData.totals.neg}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {calculatePercentage(dashboardData.totals.neg)}
              </p>
            </div>
            <ThumbsDown className="h-8 w-8 text-red-200" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Neutral</p>
              <h3 className="text-3xl font-bold text-gray-600">
                {dashboardData.totals.neu}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {calculatePercentage(dashboardData.totals.neu)}
              </p>
            </div>
            <Minus className="h-8 w-8 text-gray-200" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Tweets</p>
              <h3 className="text-3xl font-bold text-orange-500">
                {dashboardData.totals.all}
              </h3>
            </div>
            <BarChart2 className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        {/* Charts Row */}
        {dashboardData.totals.all > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Category Breakdown
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.categoryData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="Positive"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Neutral"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Negative"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Category Details
              </h3>
              <div className="space-y-6">
                {dashboardData.categoryData.map((item) => {
                  const total = item.Positive + item.Neutral + item.Negative;
                  if (total === 0) return null;

                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          {item.name}
                        </span>
                        <span className="text-gray-500">{total} tweets</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                        {item.Positive > 0 && (
                          <div
                            style={{
                              width: `${(item.Positive / total) * 100}%`,
                            }}
                            className="bg-green-500"
                          ></div>
                        )}
                        {item.Neutral > 0 && (
                          <div
                            style={{
                              width: `${(item.Neutral / total) * 100}%`,
                            }}
                            className="bg-gray-400"
                          ></div>
                        )}
                        {item.Negative > 0 && (
                          <div
                            style={{
                              width: `${(item.Negative / total) * 100}%`,
                            }}
                            className="bg-red-500"
                          ></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data analyzed yet
            </h3>
            <p className="text-gray-500">
              Head over to the Upload Dataset page to analyze some tweets.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
