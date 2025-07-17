import React, { useState } from "react";
import {
  Upload,
  CloudUpload,
  Repeat,
  AlertCircle,
  BarChart2,
} from "lucide-react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [detectionResults, setDetectionResults] = useState(null);
  const [detectionImage, setDetectionImage] = useState("");
  const [error, setError] = useState("");
  const [selectedVegetable, setSelectedVegetable] = useState(null);

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPEG, PNG, etc.)");
        return;
      }
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setDetectionResults(null);
      setDetectionImage("");
      setSelectedVegetable(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPEG, PNG, etc.)");
        return;
      }
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setDetectionResults(null);
      setDetectionImage("");
      setSelectedVegetable(null);
    }
  };

  const API_URL = process.env.REACT_APP_API_URL
  // const uploadImage = async () => {
  //   if (!selectedFile) {
  //     setError("Please select an image first");
  //     return;
  //   }

  //   setIsUploading(true);
  //   setError("");

  //   try {
  //     // Create FormData object
  //     const formData = new FormData();

  //     // Try different field names that might be expected by the API
  //     formData.append("file", selectedFile); // Try 'file' field name
  //     formData.append("image", selectedFile); // Also include 'image' field name
  //     formData.append("upload", selectedFile); // Also include 'upload' field name

  //     // Log FormData contents (for debugging)
  //     console.log(
  //       "Uploading file:",
  //       selectedFile.name,
  //       selectedFile.type,
  //       selectedFile.size
  //     );

  //     // Upload the image
  //     const uploadResponse = await fetch(
  //       `${API_URL}/upload-image`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     // Log the full response for debugging
  //     console.log("Upload status:", uploadResponse.status);
  //     const responseText = await uploadResponse.text();
  //     console.log("Response text:", responseText);

  //     if (!uploadResponse.ok) {
  //       throw new Error(
  //         `Upload failed with status: ${uploadResponse.status} - ${responseText}`
  //       );
  //     }

  //     // Try to parse the response as JSON (if it's JSON)
  //     let data;
  //     try {
  //       data = JSON.parse(responseText);
  //     } catch (e) {
  //       // If it's not JSON, use the text response
  //       data = [responseText];
  //     }

  //     // Parse the response - assuming format like: ["filename : {'parsley': 11, 'red cabbage': 1, ...}"]
  //     if (data && data.length > 0) {
  //       // Extract the JSON object from the string
  //       const resultStr = data[0];
  //       const colonIndex = resultStr.indexOf(":");

  //       if (colonIndex !== -1) {
  //         const jsonStr = resultStr.substring(colonIndex + 1).trim();
  //         // Convert the string representation of the object to an actual object
  //         try {
  //           // This is a workaround as the API returns a string representation of a Python dict
  //           // We need to replace single quotes with double quotes for valid JSON
  //           const validJsonStr = jsonStr
  //             .replace(/'/g, '"')
  //             .replace(/\s+/g, " "); // Remove extra whitespace

  //           const resultsObject = JSON.parse(validJsonStr);
  //           setDetectionResults(resultsObject);

  //           // Get the processed image
  //           const imageResponse = await fetch(
  //             `${API_URL}/get-image`,
  //             console.log("Image response status:", imageResponse.status)
  //           );

  //           if (!imageResponse.ok) {
  //             throw new Error(
  //               `Failed to get processed image: ${imageResponse.status}`
  //             );
  //           }

  //           const imageBlob = await imageResponse.blob();
  //           setDetectionImage(URL.createObjectURL(imageBlob));
  //         } catch (jsonError) {
  //           console.error("Failed to parse results:", jsonError, jsonStr);
  //           setError("Failed to parse detection results");
  //         }
  //       } else {
  //         console.log("No colon found in result string:", resultStr);
  //         setError("Unexpected response format");
  //       }
  //     } else {
  //       console.log("No data received or empty array");
  //       setError("No detection results returned");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setError(error.message || "Failed to process image");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const uploadImage = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Create FormData object
      const formData = new FormData();

      // Try different field names that might be expected by the API
      formData.append("file", selectedFile); // Try 'file' field name
      formData.append("image", selectedFile); // Also include 'image' field name
      formData.append("upload", selectedFile); // Also include 'upload' field name

      // Log FormData contents (for debugging)
      console.log(
        "Uploading file:",
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );

      // Upload the image
      const uploadResponse = await fetch(
        `${API_URL}/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Log the full response for debugging
      console.log("Upload status:", uploadResponse.status);
      const responseText = await uploadResponse.text();
      console.log("Response text:", responseText);

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload failed with status: ${uploadResponse.status} - ${responseText}`
        );
      }

      // Parse the response
      try {
        // Parse the response as JSON
        const parsedData = JSON.parse(responseText);
        console.log("Parsed JSON data:", parsedData);
        
        // Handle the specific format you're receiving: {"filename":{"vegetable1":count, ...}}
        if (parsedData && typeof parsedData === 'object') {
          // Check if it has the nested structure with filename
          if (Object.keys(parsedData).length === 1) {
            const filename = Object.keys(parsedData)[0];
            const resultsObject = parsedData[filename];
            
            if (resultsObject && typeof resultsObject === 'object') {
              console.log("Successfully extracted detection results:", resultsObject);
              setDetectionResults(resultsObject);
              
              // Get the processed image
              const imageResponse = await fetch(`${API_URL}/get-image`);
              console.log("Image response status:", imageResponse.status);
              
              if (!imageResponse.ok) {
                throw new Error(`Failed to get processed image: ${imageResponse.status}`);
              }
              
              const imageBlob = await imageResponse.blob();
              setDetectionImage(URL.createObjectURL(imageBlob));
            } else {
              throw new Error("Invalid results format: results object not found");
            }
          } else {
            // If the data doesn't have the expected nested structure,
            // assume the whole object is the results
            console.log("Using entire response as detection results");
            setDetectionResults(parsedData);
            
            // Get the processed image
            const imageResponse = await fetch(`${API_URL}/get-image`);
            console.log("Image response status:", imageResponse.status);
            
            if (!imageResponse.ok) {
              throw new Error(`Failed to get processed image: ${imageResponse.status}`);
            }
            
            const imageBlob = await imageResponse.blob();
            setDetectionImage(URL.createObjectURL(imageBlob));
          }
        } else {
          throw new Error("Invalid response format: not an object");
        }
      } catch (error) {
        console.error("Error parsing response:", error);
        setError(error.message || "Failed to parse detection results");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to process image");
    } finally {
      setIsUploading(false);
    }
  };
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setDetectionResults(null);
    setDetectionImage("");
    setError("");
    setSelectedVegetable(null);
  };

  // Calculate total vegetable count
  const totalVegetableCount = detectionResults
    ? Object.values(detectionResults).reduce(
        (sum, count) => sum + Number(count),
        0
      )
    : 0;

  // Handle vegetable click
  const handleVegetableClick = (vegetable) => {
    setSelectedVegetable(selectedVegetable === vegetable ? null : vegetable);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-gradient-to-r from-green-600 to-green-400 text-white shadow-md">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-center">
            Vegetable Detection
          </h1>
          <p className="text-center text-green-100">
            Upload an image to identify and count vegetables
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Upload Image
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              previewUrl
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            } transition-colors duration-200 cursor-pointer`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {!previewUrl ? (
              <div className="space-y-4">
                <CloudUpload className="h-16 w-16 mx-auto text-green-500" />
                <p className="text-gray-500">
                  Drag and drop an image here or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: JPG, PNG, JPEG
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-md shadow-sm"
                />
                <p className="text-sm text-gray-500">
                  {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(2)}{" "}
                  KB)
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              onClick={uploadImage}
              disabled={!selectedFile || isUploading}
              className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 ${
                !selectedFile || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              } transition-colors duration-200`}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Detect Vegetables</span>
                </>
              )}
            </button>

            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
            >
              <Repeat className="h-5 w-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {detectionResults && detectionImage && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">
              Detection Results
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Detected Image
                </h3>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={detectionImage}
                    alt="Detected vegetables"
                    className="w-full"
                  />
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <h4 className="text-sm text-green-700 font-medium mb-1">
                      Total Types
                    </h4>
                    <p className="text-2xl font-bold text-green-700">
                      {Object.keys(detectionResults).length}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <h4 className="text-sm text-green-700 font-medium mb-1">
                      Total Count
                    </h4>
                    <p className="text-2xl font-bold text-green-700">
                      {totalVegetableCount}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <h4 className="text-sm text-green-700 font-medium mb-1">
                      Most Common
                    </h4>
                    <p className="text-xl font-bold text-green-700 capitalize truncate">
                      {
                        Object.entries(detectionResults).sort(
                          (a, b) => b[1] - a[1]
                        )[0][0]
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Vegetables Detected
                </h3>

                {/* Simple table of vegetables and counts - matching the reference image style */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  {/* Table header */}
                  <div className="grid grid-cols-2 bg-green-50 border-b border-gray-200">
                    <div className="p-4 font-medium text-gray-700">
                      Vegetable
                    </div>
                    <div className="p-4 font-medium text-gray-700 text-right">
                      Count
                    </div>
                  </div>

                  {/* Table rows */}
                  <div className="divide-y divide-gray-200">
                    {Object.entries(detectionResults)
                      .sort((a, b) => b[1] - a[1])
                      .map(([vegetable, count], index) => {
                        // Get the first letter for the circle avatar
                        const firstLetter = vegetable.charAt(0).toUpperCase();

                        return (
                          <div
                            key={vegetable}
                            className="grid grid-cols-2 hover:bg-gray-50"
                          >
                            <div className="p-4 flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                                {firstLetter}
                              </div>
                              <div>
                                <div className="font-medium capitalize text-gray-700">
                                  {vegetable}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {count} detected
                                </div>
                              </div>
                            </div>
                            <div className="p-4 flex items-center justify-end">
                              <div className="text-lg font-bold text-gray-700">
                                {count}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">
            &copy; {new Date().getFullYear()} Vegetable Detection System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
