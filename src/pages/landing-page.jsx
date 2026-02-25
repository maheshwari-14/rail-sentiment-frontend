import { BarChart2, ShieldCheck, Train, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <nav className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-md">
            <Train className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">RailSentiment</span>
        </div>
        <Link
          to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Analyze Indian Railway <br />
            <span className="text-orange-500">Tweet Sentiments</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A knowledge-based system using Protégé technology for accessing
            sentiments of Indian Railway tweets. Classify tweets as positive,
            negative, or neutral across 5 key categories.
          </p>
          <Link
            to="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors shadow-md"
          >
            Start Analyzing
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-lg mb-4 text-orange-500">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Upload Datasets</h3>
            <p className="text-sm text-gray-500">
              Paste or upload Indian Railway tweets for analysis
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-lg mb-4 text-orange-500">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Sentiment Analysis</h3>
            <p className="text-sm text-gray-500">
              AI-powered classification into positive, negative & neutral
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-lg mb-4 text-orange-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              5 Category Insights
            </h3>
            <p className="text-sm text-gray-500">
              Cleanliness, Staff Behaviour, Punctuality, Security & Timeliness
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
