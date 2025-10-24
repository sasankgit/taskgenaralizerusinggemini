import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // adjust path if needed

export default function ImageSummarizer() {
  const [user, setUser] = useState(null);
  const [latestImageUrl, setLatestImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  // 1️⃣ Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      else setUser(data.user);
    };
    fetchUser();
  }, []);

  // 2️⃣ Fetch latest uploaded image for this user
  useEffect(() => {
    const fetchLatestImage = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('uploads')
        .select('image_url')
        .eq('id', user.id)
        .order('time', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(error);
      } else if (data?.image_url?.url) {
        setLatestImageUrl(data.image_url.url);
      }
    };
    fetchLatestImage();
  }, [user]);

  // 3️⃣ Send to Gemini API
  const summarizeImage = async () => {
    if (!latestImageUrl) {
      alert('No image found.');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const apiKey = import.meta.env.VITE_API_KEY_GEMINI;

      // Convert image URL to base64 (Gemini requires raw bytes)
      const response = await fetch(latestImageUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64Image = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      // Call Gemini API
      const result = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
          apiKey,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: 'Summarize what is seen in this image in detail.' },
                  {
                    inline_data: {
                      mime_type: blob.type,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await result.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setSummary(text || 'No summary found.');
    } catch (err) {
      console.error(err);
      setSummary('Error summarizing image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold">🖼️ Gemini Image Summarizer</h2>

      {latestImageUrl ? (
        <div className="flex flex-col items-center space-y-3">
          <img
            src={latestImageUrl}
            alt="Latest upload"
            className="rounded-xl shadow-md w-64 h-64 object-cover"
          />
          <button
            onClick={summarizeImage}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {loading ? 'Analyzing...' : 'Summarize Image'}
          </button>
        </div>
      ) : (
        <p>No uploaded images found for this user.</p>
      )}

      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
          <h3 className="font-semibold mb-2">📝 Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
