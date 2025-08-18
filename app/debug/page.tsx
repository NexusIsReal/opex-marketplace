import { readdirSync } from 'fs';
import path from 'path';
import Link from 'next/link';

export default function DebugPage() {
  // Get a list of files in the uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  let files: string[] = [];
  
  try {
    files = readdirSync(uploadsDir);
  } catch (error) {
    console.error('Error reading uploads directory:', error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug File Serving</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Test File Serving</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Direct URL</h3>
            <p className="text-sm text-gray-300 mb-4">
              Tests accessing files directly from the /uploads/ path
            </p>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file} className="flex items-center gap-2">
                  <a 
                    href={`/uploads/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {file}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">API Route</h3>
            <p className="text-sm text-gray-300 mb-4">
              Tests accessing files through the /api/serve-file API route
            </p>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file} className="flex items-center gap-2">
                  <a 
                    href={`/api/serve-file?path=/uploads/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {file}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">File Information</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4">File Name</th>
              <th className="py-2 px-4">Direct URL</th>
              <th className="py-2 px-4">API URL</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file} className="border-b border-gray-700">
                <td className="py-2 px-4">{file}</td>
                <td className="py-2 px-4 text-sm text-gray-400">/uploads/{file}</td>
                <td className="py-2 px-4 text-sm text-gray-400">/api/serve-file?path=/uploads/{file}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
