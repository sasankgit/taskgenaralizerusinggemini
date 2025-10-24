import { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { supabase } from '../supabase';
// Initialize Supabase client




function ImageUploadApp() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setUploadResult(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [droppedFile] } };
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadResult(null);
  };

  const uploadImage = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = fileName;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      const imageUrl = urlData.publicUrl;
      
      // Save metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('uploads')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          image_url: imageUrl,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (dbError) {
        // Rollback: delete uploaded file
        await supabase.storage.from('images').remove([filePath]);
        throw new Error(`Database error: ${dbError.message}`);
      }
      
      setUploadResult({
        success: true,
        imageUrl,
        uploadId: dbData.id,
        filePath
      });
      
    } catch (err) {
      setError(err.message);
      setUploadResult({ success: false });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Image className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Upload</h1>
            <p className="text-gray-600">Upload your images to Supabase storage</p>
          </div>

          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-gray-50"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, GIF, WebP (Max 5MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Filename:</span> {file.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Size:</span> {(file.size / 1024).toFixed(2)} KB
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {file.type}
                </p>
              </div>

              <button
                onClick={uploadImage}
                disabled={uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Upload Failed</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {uploadResult && uploadResult.success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-800 mb-2">Upload Successful!</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-green-700 font-medium">Upload ID:</p>
                      <p className="text-green-600 break-all">{uploadResult.uploadId}</p>
                    </div>
                    <div>
                      <p className="text-green-700 font-medium">Image URL:</p>
                      <p className="text-green-600 break-all">{uploadResult.imageUrl}</p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload Another Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Make sure to replace the Supabase URL and Key in the code</p>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadApp;