"use client";

import { useState } from "react";

interface ParsedResponse {
  exact: string;
  grading: {
    taskResponse: string;
    coherence: string;
    lexicalResource: string;
    grammarAndAccuracy: string;
    band: string;
  };
  better: string;
  feedback: string;
}

export default function Home() {
  const [essay, setEssay] = useState<string>("");
  const [parsedResponse, setParsedResponse] = useState<ParsedResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Function to count words
  const wordCount = essay
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;

  const submitEssay = async () => {
    if (!essay) {
      alert("Please enter your essay!");
      return;
    }

    setLoading(true);
    setParsedResponse(null);

    try {
      const response = await fetch("/api/checkEssay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ essay }),
      });

      if (!response.ok) {
        throw new Error("Failed to check essay");
      }

      const data = await response.json();

      // Parse the XML response into a JavaScript object
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(
        data.xmlResponse,
        "application/xml"
      );

      const parseSection = (tagName: string) =>
        xmlDoc.getElementsByTagName(tagName)[0]?.innerHTML.trim() || "";

      const responseObject: ParsedResponse = {
        exact: parseSection("exact"),
        grading: {
          taskResponse: parseSection("taskResponse"),
          coherence: parseSection("coherence"),
          lexicalResource: parseSection("lexicalResource"),
          grammarAndAccuracy: parseSection("grammerAndAccuracy"),
          band: parseSection("BAND"),
        },
        better: parseSection("better"),
        feedback: parseSection("feedback"),
      };

      setParsedResponse(responseObject);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const highlightErrors = (text: string) => {
    return text
      .split("\n\n") // Split text into paragraphs
      .map(
        (paragraph) =>
          `<p class="mb-4">${paragraph
            .replace(
              /<grammer>(.*?)<\/grammer>/g,
              `<span class="text-blue-600">$1</span>`
            )
            .replace(
              /<spelling>(.*?)<\/spelling>/g,
              `<span class="text-red-600">$1</span>`
            )}</p>`
      )
      .join(""); // Rejoin paragraphs with proper wrapping
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">
        English Essay Checker
      </h1>
      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        placeholder="Paste your essay here..."
        rows={10}
        className="w-full max-w-3xl p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
      {/* Word Count */}
      <div
        className={`mt-2 text-sm font-medium ${
          wordCount > 250 ? "text-red-600" : "text-gray-600"
        }`}
      >
        Word Count: {wordCount}
      </div>
      <button
        onClick={submitEssay}
        disabled={loading}
        className={`mt-4 px-6 py-2 text-white font-semibold rounded-md transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Checking..." : "Check Essay"}
      </button>
      {parsedResponse && (
        <div className="w-full max-w-3xl mt-6 bg-white shadow-md rounded-md p-4 space-y-4">
          <section>
            <h2 className="text-lg font-semibold text-gray-700">Exact Essay</h2>
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightErrors(parsedResponse.exact),
              }}
            ></div>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-700">Grading</h2>
            <ul className="text-gray-800 leading-relaxed space-y-2">
              <li>
                <strong>Task Response:</strong>{" "}
                {parsedResponse.grading.taskResponse}
              </li>
              <li>
                <strong>Coherence:</strong> {parsedResponse.grading.coherence}
              </li>
              <li>
                <strong>Lexical Resource:</strong>{" "}
                {parsedResponse.grading.lexicalResource}
              </li>
              <li>
                <strong>Grammar and Accuracy:</strong>{" "}
                {parsedResponse.grading.grammarAndAccuracy}
              </li>
              <li>
                <strong>Band:</strong> {parsedResponse.grading.band}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-700">
              Better Version
            </h2>
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightErrors(parsedResponse.better),
              }}
            ></div>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-700">Feedback</h2>
            <p className="text-gray-800 leading-relaxed">
              {parsedResponse.feedback}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
