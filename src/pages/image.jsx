import React, { useState } from 'react';
import { supabase } from '../supabase'; // Import your client

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handles the file input change event.
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log('File selected:', selectedFile); // DEBUG
      setFile(selectedFile);
      setError(null);
      setSuccessMessage('');
    } else {
      console.log('File selection cancelled.'); // DEBUG
      setFile(null);
    }
  };

  /**
   * Handles the file upload to Supabase Storage.
   */
  const handleUpload = async () => {
    console.log('handleUpload triggered'); // DEBUG

    if (!file) {
      const errorMsg = 'You must select an image to upload.';
      console.error(errorMsg); // DEBUG
      setError(errorMsg);
      return;
    }

    console.log('Setting uploading state to true'); // DEBUG
    setUploading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const filePath = `public/${file.name}`;
      console.log(`Attempting to upload to bucket: 'images', path: ${filePath}`); // DEBUG

      // Upload the file to the 'images' bucket
      const { data, error: uploadError } = await supabase.storage
        .from('images') // !! Make sure 'images' matches your bucket name
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false, 
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError); // DEBUG
        throw uploadError;
      }

      console.log('Upload successful, data:', data); // DEBUG

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      console.log('Public URL data:', publicUrlData); // DEBUG

      if (!publicUrlData) {
        throw new Error('Could not get public URL.');
      }

      const publicUrl = publicUrlData.publicUrl;
      setSuccessMessage(`File uploaded successfully! URL: ${publicUrl}`);
      console.log(`Success! URL: ${publicUrl}`); // DEBUG

      setFile(null); // Clear the file
      // Find the file input element by its ID and reset it
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = null; // This clears the file input field
      }
      
    } catch (err) {
      console.error('Upload failed:', err.message); // DEBUG
      
      if (err.message?.includes('Duplicate')) {
        setError('Upload failed: A file with this name already exists.');
      } else if (err.message?.includes('policy')) {
        setError('Upload failed: Storage policy violation. Check your RLS policies.');
      } else {
        setError(`Upload failed: ${err.message}`);
      }
    } finally {
      console.log('Setting uploading state to false'); // DEBUG
      setUploading(false);
    }
  };

  // Check the state of the button's disabled logic
  const isButtonDisabled = uploading || !file;
  // console.log(`Button disabled: ${isButtonDisabled} (uploading: ${uploading}, file: ${file ? 'exists' : 'null'})`); // DEBUG (this one is noisy)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Upload Image to Supabase</h2>
      
      {/* This is the actual file input. We hide it with 'display: none'.
        The 'id' is crucial for the <label> to find it.
      */}
      <input
        type="file"
        id="file-input"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: 'none' }} // Hide the default input
      />
      
      {/* This <label> is styled to look like a button. 
        Clicking it will trigger the hidden file input above.
      */}
      <label 
        htmlFor="file-input" 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          display: 'inline-block',
          marginRight: '10px',
          opacity: uploading ? 0.5 : 1, // Visually disable if uploading
          pointerEvents: uploading ? 'none' : 'auto', // Prevent clicks while uploading
        }}
      >
        Select File
      </label>

      {/* This is the original upload button. 
        We'll style it similarly for consistency.
      */}
      <button 
        onClick={handleUpload} 
        disabled={isButtonDisabled}
        style={{
          backgroundColor: isButtonDisabled ? '#ccc' : '#28a745',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          border: 'none',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Show the selected file name */}
      {file && !successMessage && (
        <p style={{ marginTop: '10px' }}>
          Selected file: {file.name}
        </p>
      )}

      {/* Show error message */}
      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
      )}

      {/* Show success message */}
      {successMessage && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          <p>{successMessage}</p>
          <img 
            src={successMessage.split('URL: ')[1]} 
            alt="Uploaded" 
            style={{ maxWidth: '300px', marginTop: '10px' }} 
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

