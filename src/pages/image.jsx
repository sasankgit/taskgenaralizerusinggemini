import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function ImageUpload() {
  const [personName, setPersonName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);

  // Fetch current user
  React.useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      else setUser(data.user);
    };
    getUser();
  }, []);

  const handleUpload = async () => {
    if (!user) {
      setStatus('Please log in first.');
      return;
    }

    if (!personName || !imageFile) {
      setStatus('Please enter a name and select an image.');
      return;
    }

    const imageName = `${Date.now()}_${imageFile.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(imageName, imageFile);

    if (uploadError) {
      console.error(uploadError);
      setStatus('Image upload failed.');
      return;
    }

    // Insert metadata into Supabase table
    const { error: dbError } = await supabase.from('uploads').insert([
      {
        user_id: user.id,
        person_name: personName,
        image_name: imageName,
      },
    ]);

    if (dbError) {
      console.error(dbError);
      setStatus('Database insert failed.');
    } else {
      setStatus('✅ Upload successful!');
      setPersonName('');
      setImageFile(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Upload an Image</h1>
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <input
          type="text"
          placeholder="Enter person name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-purple-500 w-full py-2 rounded font-semibold hover:bg-purple-600 transition"
        >
          Upload
        </button>
        <p className="mt-4 text-sm text-center text-gray-400">{status}</p>
      </div>
    </div>
  );
}
