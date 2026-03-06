import {
  BarChart2,
  Brain,
  CheckCircle2,
  FileText,
  Network,
  Sparkles,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout";

// Ontology categories from the OWL knowledge base
const ONTOLOGY_CATEGORIES = [
  {
    name: "Cleanliness",
    icon: "🧹",
    subclasses: ["Verygood", "Verybad"],
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    description: "Hygiene and cleanliness ratings",
  },
  {
    name: "Staff Behavior",
    icon: "👤",
    subclasses: ["Good", "Bad"],
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    description: "Staff conduct and helpfulness",
  },
  {
    name: "Food Quality",
    icon: "🍽️",
    subclasses: ["Tasty", "Nottasty"],
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    description: "On-board food quality ratings",
  },
  {
    name: "Punctuality",
    icon: "⏰",
    subclasses: ["Time", "Freequency"],
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    description: "Schedule adherence and frequency",
  },
  {
    name: "Security",
    icon: "🛡️",
    subclasses: ["High", "Low"],
    color: "from-rose-500 to-red-600",
    bg: "bg-rose-50",
    text: "text-rose-700",
    description: "Safety and security assessment",
  },
];

const SUPPORTED_FORMATS = [
  { ext: ".txt", label: "Text File", desc: "One tweet per line" },
  { ext: ".csv", label: "CSV File", desc: "Tweets in first column" },
  { ext: "Paste", label: "Manual Input", desc: "Type or paste directly" },
];

const STEPS = [
  {
    step: 1,
    title: "Upload your dataset",
    desc: "Upload a .txt or .csv file, or paste tweets manually",
  },
  {
    step: 2,
    title: "AI analyzes sentiment",
    desc: "VADER + OWL ontology classifies each tweet",
  },
  {
    step: 3,
    title: "View detailed charts",
    desc: "See category-wise sentiment breakdown",
  },
];

export default function DashboardPage() {
  const [sentimentData] = useState(() => {
    const saved = localStorage.getItem("sentimentData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const analysis = parsed.analysis;
        let totalPos = 0,
          totalNeg = 0,
          totalNeu = 0,
          total = 0;
        Object.values(analysis).forEach((c) => {
          totalPos += c.Positive;
          totalNeg += c.Negative;
          totalNeu += c.Neutral;
          total += c.Positive + c.Negative + c.Neutral;
        });
        return { dataset: parsed.dataset, total, totalPos, totalNeg, totalNeu };
      } catch {
        return null;
      }
    }
    return null;
  });

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Indian Railway Sentiment Analysis using Protégé Ontology & VADER NLP
          </p>
        </div>

        {/* Upload CTA — Main Focus */}
        <div className="mb-8 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 rounded-xl p-3">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upload & Analyze Tweets</h2>
                <p className="text-sm opacity-80">
                  Upload your Indian Railway tweet dataset to get AI-powered
                  sentiment analysis
                </p>
              </div>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
              {STEPS.map((s) => (
                <div
                  key={s.step}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {s.step}
                    </span>
                    <h4 className="font-semibold text-sm">{s.title}</h4>
                  </div>
                  <p className="text-xs opacity-80">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Supported formats */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-medium opacity-70">Supported:</span>
              {SUPPORTED_FORMATS.map((f) => (
                <span
                  key={f.ext}
                  className="bg-white/15 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {f.ext} — {f.desc}
                </span>
              ))}
            </div>

            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors shadow-md"
            >
              <Upload className="w-5 h-5" />
              Go to Upload Page
            </Link>
          </div>
        </div>

        {/* Recent Analysis Summary (if data exists) */}
        {sentimentData && (
          <div className="mb-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Last Analysis: {sentimentData.dataset}
              </h2>
              <Link
                to="/charts"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <BarChart2 className="w-4 h-4" /> View Charts →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {sentimentData.total}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Tweets</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {sentimentData.totalPos}
                </p>
                <p className="text-xs text-gray-500 mt-1">Positive</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {sentimentData.totalNeu}
                </p>
                <p className="text-xs text-gray-500 mt-1">Neutral</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {sentimentData.totalNeg}
                </p>
                <p className="text-xs text-gray-500 mt-1">Negative</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 rounded-lg p-3">
              <Brain className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">21</p>
              <p className="text-xs text-gray-500">Ontology Classes</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-500">Sentiment Categories</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-purple-50 rounded-lg p-3">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">.txt / .csv</p>
              <p className="text-xs text-gray-500">Supported Formats</p>
            </div>
          </div>
        </div>

        {/* Ontology Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-orange-500" />
            Sentiment Categories (from OWL Ontology)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ONTOLOGY_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`h-1.5 bg-gradient-to-r ${cat.color}`} />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{cat.icon}</span>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {cat.description}
                  </p>
                  <div className="space-y-1">
                    {cat.subclasses.map((sub) => (
                      <span
                        key={sub}
                        className={`inline-block mr-1 px-2 py-0.5 text-xs font-medium rounded-full ${cat.bg} ${cat.text}`}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/upload"
              className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-4"
            >
              <div className="bg-orange-50 rounded-lg p-3 group-hover:bg-orange-100 transition-colors">
                <Upload className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Tweets</h3>
                <p className="text-xs text-gray-500">
                  Analyze new tweet dataset
                </p>
              </div>
            </Link>
            <Link
              to="/charts"
              className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4"
            >
              <div className="bg-blue-50 rounded-lg p-3 group-hover:bg-blue-100 transition-colors">
                <BarChart2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Charts</h3>
                <p className="text-xs text-gray-500">
                  {sentimentData
                    ? `${sentimentData.total} tweets analyzed`
                    : "No analysis yet"}
                </p>
              </div>
            </Link>
            <Link
              to="/ontology"
              className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-4"
            >
              <div className="bg-purple-50 rounded-lg p-3 group-hover:bg-purple-100 transition-colors">
                <Network className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Knowledge Graph</h3>
                <p className="text-xs text-gray-500">Explore OWL ontology</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
