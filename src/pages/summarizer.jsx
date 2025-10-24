import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Image, AlertCircle, Loader2 } from 'lucide-react';
import {supabase} from '../supabase'

// Gemini API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY_GEMINI; // Replace with your Gemini API key

// Simple Supabase client implementation


// Function to summarize image using Gemini API
async function summarizeImageWithGemini(filePath) {
  try {
    console.log('Getting signed URL for:', filePath);
    
    // Get a signed URL for the image (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('images')
      .createSignedUrl(filePath, 3600);
    
    if (urlError || !urlData) {
      throw new Error('Failed to get signed URL for image');
    }
    
    const signedUrl = urlData.signedUrl;
    console.log('Signed URL:', signedUrl);
    
    // Fetch the image
    const imageResponse = await fetch(signedUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    
    const imageBlob = await imageResponse.blob();
    console.log('Image blob size:', imageBlob.size, 'type:', imageBlob.type);
    
    // Convert blob to base64
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    // Determine mime type
    const mimeType = imageBlob.type || 'image/png';
    console.log('Calling Gemini API with mime type:', mimeType);

    // Call Gemini API with correct endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this image and provide a detailed summary describing what you see. Include objects, people, activities, colors, setting, and any text visible in the image."
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error response:', errorData);
      throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';
    
    return { success: true, summary };
  } catch (error) {
    console.error('Gemini API error:', error);
    return { success: false, error: error.message };
  }
}

function ImageSummarizer() {
  const [latestUpload, setLatestUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the latest uploaded image
  const fetchLatestUpload = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('uploads')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        throw new Error(`Failed to fetch: ${fetchError.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No uploads found. Please upload an image first.');
      }

      setLatestUpload(data[0]);
    } catch (err) {
      setError(err.message);
      setLatestUpload(null);
    } finally {
      setLoading(false);
    }
  };

  // Summarize the image
  const handleSummarize = async () => {
    if (!latestUpload) return;

    setSummarizing(true);
    setError(null);

    try {
      console.log('Starting summarization for:', latestUpload.file_path);
      
      // Call Gemini API to summarize using file_path instead of image_url
      const result = await summarizeImageWithGemini(latestUpload.file_path);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Summary generated:', result.summary);

      // Update the database with the summary
      const updatePayload = {
        summary: result.summary,
        summary_generated_at: new Date().toISOString()
      };
      
      console.log('Updating database for ID:', latestUpload.id);
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/uploads?id=eq.${latestUpload.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updatePayload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update error:', errorData);
        throw new Error(`Failed to save summary: ${errorData.message || response.statusText}`);
      }

      const updatedDataArray = await response.json();
      
      if (!updatedDataArray || updatedDataArray.length === 0) {
        throw new Error('No data returned after update');
      }

      const updatedData = updatedDataArray[0];
      console.log('Database updated successfully:', updatedData);

      // Update local state
      setLatestUpload(updatedData);
    } catch (err) {
      console.error('Summarization error:', err);
      setError(err.message);
    } finally {
      setSummarizing(false);
    }
  };

  // Load latest upload on component mount
  useEffect(() => {
    fetchLatestUpload();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Summarizer</h1>
            <p className="text-gray-600">AI-powered image analysis using Gemini</p>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={fetchLatestUpload}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Latest Upload
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading latest upload...</p>
            </div>
          )}

          {/* Image Display */}
          {!loading && latestUpload && (
            <div className="space-y-6">
              {/* Image Card */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={latestUpload.image_url}
                  alt={latestUpload.file_name}
                  className="w-full h-96 object-contain bg-gray-50"
                />
              </div>

              {/* Image Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Filename:</span> {latestUpload.file_name}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Uploaded:</span>{' '}
                  {new Date(latestUpload.uploaded_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Size:</span>{' '}
                  {(latestUpload.file_size / 1024).toFixed(2)} KB
                </p>
              </div>

              {/* Summarize Button */}
              {!latestUpload.summary && (
                <button
                  onClick={handleSummarize}
                  disabled={summarizing}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {summarizing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Summarize Image with AI
                    </>
                  )}
                </button>
              )}

              {/* Summary Display */}
              {latestUpload.summary && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Summary</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {latestUpload.summary}
                      </p>
                    </div>
                  </div>
                  {latestUpload.summary_generated_at && (
                    <p className="text-xs text-purple-600 mt-4">
                      Generated: {new Date(latestUpload.summary_generated_at).toLocaleString()}
                    </p>
                  )}
                  <button
                    onClick={handleSummarize}
                    disabled={summarizing}
                    className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Summary
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !latestUpload && !error && (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No uploads found</p>
              <p className="text-sm text-gray-500 mt-2">Upload an image first to get started</p>
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 font-medium mb-2">Setup Instructions:</p>
          <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>Replace GEMINI_API_KEY with your actual Gemini API key</li>
            <li>Make sure the 'summary' and 'summary_generated_at' columns exist in uploads table</li>
            <li>Ensure your images bucket has public read access</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ImageSummarizer;