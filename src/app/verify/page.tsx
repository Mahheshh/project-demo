'use client';
import generateHash from '@/lib/hashGenerator';
import { useState } from 'react';

export default function VerifyPage() {
    const [caseNo, setCaseNo] = useState('');
    const [result, setResult] = useState<{ isValid?: boolean; error?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        if (!file) {
            return
        }
        const hash = await generateHash(file);
        try {
            const response = await fetch(`/api/verify?caseNo=${caseNo}&hash=${hash}`);
            const data = await response.json();
            setResult(data);
        } catch {
            setResult({ error: 'Failed to verify. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Verify Document
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">Authenticate your document integrity</p>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                        {/* Error Display */}
                        {result?.error && (
                            <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6">
                                <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-700 font-medium text-sm sm:text-base break-words">{result.error}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Section */}
                        <div className="p-4 sm:p-6 lg:p-8">
                            <form onSubmit={handleVerify} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label htmlFor="caseNo" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Case Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="caseNo"
                                            placeholder="Enter case number"
                                            value={caseNo}
                                            onChange={(e) => setCaseNo(e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 text-sm sm:text-base"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Document File
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="file"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 text-sm sm:text-base file:mr-3 sm:file:mr-4 file:py-1 file:px-2 sm:file:px-3 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                                            required
                                        />
                                    </div>
                                </div>

                                {file && (
                                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Selected File
                                        </label>
                                        <div className="flex items-center gap-2 sm:gap-3 text-sm text-gray-600 min-w-0">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="font-medium truncate min-w-0 flex-1 text-sm sm:text-base">{file.name}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Verify Document
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Result Display */}
                            {result?.isValid !== undefined && (
                                <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl border-2 ${result.isValid
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                                    }`}>
                                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                                        {result.isValid ? (
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        <div className="text-center min-w-0 flex-1">
                                            <h3 className={`text-base sm:text-lg font-bold ${result.isValid ? 'text-green-700' : 'text-red-700'} break-words`}>
                                                {result.isValid ? 'Document Verified!' : 'Verification Failed'}
                                            </h3>
                                            <p className={`text-xs sm:text-sm ${result.isValid ? 'text-green-600' : 'text-red-600'} break-words`}>
                                                {result.isValid ? 'Your document is authentic and valid.' : 'Document could not be verified.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}