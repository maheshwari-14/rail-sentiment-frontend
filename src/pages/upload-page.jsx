import { FileText, FileUp, Type, Upload as UploadIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

export default function UploadPage() {
  const [uploadMode, setUploadMode] = useState("text"); // 'text' or 'file'
  const [datasetName, setDatasetName] = useState("");
  const [tweets, setTweets] = useState("");
  const [file, setFile] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoadSample = () => {
    setDatasetName("January 2026 Test Data");
    setTweets(
      "Train 12486 was 2 hours late today.\nFood quality is improving on Rajdhani.\nThe station staff was very helpful with my luggage.\nSecurity needs to be tighter at night.\nCleanliness in AC coaches is highly acceptable.",
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.name.endsWith(".txt") ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        if (!datasetName) setDatasetName(selectedFile.name.split(".")[0]);
        setError("");
      } else {
        setError("Please upload a valid .txt or .csv file");
        setFile(null);
      }
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError("");

    try {
      let response;

      if (uploadMode === "text") {
        const tweetArray = tweets.split("\n").filter((t) => t.trim() !== "");
        response = await fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ datasetName, tweets: tweetArray }),
        });
      } else {
        if (!file) throw new Error("Please select a file first.");

        const formData = new FormData();
        formData.append("datasetName", datasetName);
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/analyze-file", {
          method: "POST",
          body: formData, // Browser automatically sets the correct multipart headers
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to analyze on the server.");
      }

      const data = await response.json();
      localStorage.setItem("sentimentData", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Dataset</h1>
          <p className="mt-2 text-sm text-gray-600">
            Submit Indian Railway tweets via text or file (.csv, .txt) for
            Protégé inference.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          {/* Tabs for Input Mode */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setUploadMode("text")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                uploadMode === "text"
                  ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Type className="w-4 h-4" /> Paste Text
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                uploadMode === "file"
                  ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FileUp className="w-4 h-4" /> Upload File
            </button>
          </div>

          <div className="px-6 py-6">
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dataset Name
                </label>
                <input
                  type="text"
                  required
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="e.g., February 2026 Tweets"
                />
              </div>

              {uploadMode === "text" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tweets (one per line)
                  </label>
                  <textarea
                    rows={8}
                    required={uploadMode === "text"}
                    value={tweets}
                    onChange={(e) => setTweets(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Paste tweets here..."
                  />
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="mt-3 bg-white py-1.5 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Load Sample Text
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".txt,.csv"
                        onChange={handleFileChange}
                        required={uploadMode === "file"}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    CSV or TXT up to 10MB
                  </p>
                  {file && (
                    <p className="mt-4 text-sm font-bold text-green-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isAnalyzing || (uploadMode === "file" && !file)}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                <UploadIcon className="h-5 w-5" />
                {isAnalyzing ? "Running Inference..." : "Analyze Dataset"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
