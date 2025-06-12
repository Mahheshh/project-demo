/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import FilePreview from '@/components/filePreview';
import { useCourtContract } from '@/hooks/contract';
import generateHash from '@/lib/hashGenerator';
import { WalletContext } from '@/providers/WalletProvider';
import { useContext, useState } from 'react';

interface FileData {
    fileName: string;
    fileType: string;
    hash: string;
    dataSource: string;
}

const Upload = () => {
    const [file, setFile] = useState<File[]>([]);
    const [fileData, setFileData] = useState<FileData[]>([]);
    const [caseNo, setCaseNo] = useState('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [error, setError] = useState('');
    const { contract } = useCourtContract();
    const wallet = useContext(WalletContext);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const fileList = Array.from(e.target.files);
        setFile(fileList);

        const filesData = await Promise.all(
            fileList.map(async (file) => {
                const hash = await generateHash(file);
                const fileExtension = file.name.split('.').pop() || '';

                const base64String = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                return {
                    fileName: file.name,
                    fileType: fileExtension.toLowerCase(),
                    hash: hash,
                    dataSource: base64String
                };
            })
        );
        setFileData(filesData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUploading) {
            return;
        }
        try {
            setIsUploading(true);
            // await new Promise((resolve, reject) => {
            contract!.methods.addDocument(caseNo, [''])
                .send({ from: wallet?.address as string })
                .on('confirmation', () => {
                    console.log('Transaction confirmed:');
                    // resolve(true);
                })
                .on('transactionHash', (hash: string) => {
                    console.log('Transaction hash:', hash);
                })
                .on('error', (error: any) => {
                    console.error('Transaction error:', error);
                    // reject(error);
                });
            // });

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caseNo: parseInt(caseNo),
                    files: fileData
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                return;
            }

            setFile([]);
            setFileData([]);
            setCaseNo('');
            setError('');
            setDocuments([]);
            // alert(`Files uploaded successfully! Version ${data.version.versionNo} created with ${data.filesUploaded} files.`);

        } catch (err) {
            setError(`Failed to upload files ${err}`);
        } finally {
            setIsUploading(false)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Upload Documents
                    </h1>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Upload Form Card */}
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Document Upload</h2>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 rounded-lg border-l-4 border-red-400 mb-6">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm sm:text-base text-red-700 font-medium">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="caseNo" className="block text-sm font-medium text-gray-700 mb-2">
                                            Case Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                id="caseNo"
                                                placeholder="Enter Case Number"
                                                value={caseNo}
                                                onChange={(e) => setCaseNo(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1H8z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Files <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="file"
                                                onChange={handleFileChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600"
                                                required
                                                multiple
                                            />
                                        </div>
                                        {file.length > 0 && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-700 font-medium">
                                                    {file.length} file{file.length !== 1 ? 's' : ''} selected
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${isUploading
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                                }`}
                                            disabled={isUploading}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                {isUploading ? (
                                                    <>
                                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Upload Documents
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* File Information Card */}
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">File Information</h3>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                                {fileData.length > 0 ? (
                                    <div className="space-y-4">
                                        {fileData.map((fileInfo, index) => (
                                            <div key={index} className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-200 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                            {index + 1}
                                                        </div>
                                                        <span className="font-semibold text-gray-900 text-sm">
                                                            {fileInfo.fileName}
                                                        </span>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {fileInfo.fileType.toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 mb-1">Hash:</p>
                                                        <div className="bg-gray-100 rounded-lg p-2 font-mono text-xs text-gray-700 hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="truncate min-w-0 flex-1">{fileInfo.hash}</span>
                                                                <svg className="w-3 h-3 text-gray-400 hover:text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 sm:py-8">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium text-sm sm:text-base">Select files to see their information</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Associated Documents */}
                    {documents.length > 0 && (
                        <div className="mt-6 lg:mt-8">
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Associated Documents</h3>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    <div className="space-y-3">
                                        {documents.map((doc, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-900 font-semibold flex-1">{doc.filename}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Information Section */}
                    <div className="mt-6 lg:mt-8">
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">File Preview</h3>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {fileData.length > 0 ? (
                                    <div className="space-y-6">
                                        {fileData.map((fileInfo, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{fileInfo.fileName}</h4>
                                                </div>
                                                <div className="p-4">
                                                    <FilePreview selectedFile={{
                                                        dataSource: fileInfo.dataSource,
                                                        fileName: fileInfo.fileName
                                                    }} poppins={{
                                                        className: ''
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium">No files selected for preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;