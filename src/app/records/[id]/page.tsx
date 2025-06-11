/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { notFound, useParams } from 'next/navigation';
import { Poppins } from "next/font/google";
import { useState, useEffect } from 'react';
import getCaseDetails from '@/app/actions/getCaseDetails';
import FilePreview from '@/components/filePreview';

const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });


export default function CaseDetails() {
  const params = useParams();
  const { id } = params;
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCaseDetails(id as string);
      setCaseDetails(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
  };

  const renderFilePreview = () => {
    if (!selectedFile) {
      return (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className={`${poppins.className} text-2xl font-bold text-gray-900 mb-4`}>
            File Preview
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Select any file from the versions below to preview its contents in this area.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className={`${poppins.className} text-lg font-bold text-gray-900`}>
              {selectedFile.fileName}
            </h3>
            <p className="text-sm text-gray-500">File Preview</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 min-h-[400px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
          <FilePreview selectedFile={{
            dataSource: selectedFile.dataSource,
            fileName: selectedFile.fileName
          }} poppins={{
            className: poppins.className
          }} />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <span className="text-sm font-medium text-green-800">Preview Status</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              File loaded
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <span className="text-sm font-medium text-blue-800">File Hash</span>
            <code className="text-xs font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {selectedFile.hash.substring(0, 12)}...
            </code>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseDetails) {
    notFound();
  }

  const totalFiles = caseDetails.versions.reduce((total: number, version: any) => total + version.files.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

          <div className="lg:w-2/3">

            <div className="group relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-8 mb-8 hover:transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <h2 className={`${poppins.className} text-3xl font-bold mb-6`}>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Case Overview
                  </span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Attorney</p>
                        <p className={`${poppins.className} text-lg font-semibold text-gray-900`}>{caseDetails.attorney}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Defendant</p>
                        <p className={`${poppins.className} text-lg font-semibold text-gray-900`}>{caseDetails.defendant}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                          <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Versions</p>
                        <p className={`${poppins.className} text-lg font-semibold text-gray-900`}>{caseDetails.versions.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Files</p>
                        <p className={`${poppins.className} text-lg font-semibold text-gray-900`}>{totalFiles}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className={`${poppins.className} text-2xl font-bold mb-6`}>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Document Versions
                </span>
              </h3>

              {caseDetails.versions.map((version: any) => (
                <div key={version.id} className="group relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">v{version.versionNo}</span>
                      </div>
                      <div>
                        <h4 className={`${poppins.className} text-xl font-bold text-gray-900`}>
                          Version {version.versionNo}
                        </h4>
                        <p className="text-sm text-gray-500">{version.files.length} files</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
                            <th className="px-6 py-4 text-left rounded-l-xl">File Name</th>
                            <th className="px-6 py-4 text-left rounded-r-xl">Hash</th>
                          </tr>
                        </thead>
                        <tbody>
                          {version.files.map((file: any, index: number) => (
                            <tr key={file.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">{index + 1}</span>
                                  </div>
                                  <button
                                    onClick={() => handleFileClick(file)}
                                    className={`${poppins.className} font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-left`}
                                  >
                                    {file.fileName}
                                  </button>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <code className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-800 break-all">
                                  {file.hash}
                                </code>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="group relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  {renderFilePreview()}

                  {!selectedFile && (
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <span className="text-sm font-medium text-gray-800">Preview Status</span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          No file selected
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <span className="text-sm font-medium text-blue-800">Supported Formats</span>
                        <span className="text-sm font-semibold text-blue-600">PDF, DOC, TXT, Images</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-6 text-center">
                        Click on any file name to load preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}