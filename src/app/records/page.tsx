"use client";
import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface File {
    id: number;
    fileName: string;
    fileType: string;
    hash: string;
    dataSource: string;
}

interface Version {
    id: number;
    versionNo: number;
    files: File[];
}

interface LegalCase {
    id: number;
    caseTitle: string;
    attorney: string;
    defendant: string;
    versions: Version[];
    totalVersions: number;
    totalFiles: number;
    latestVersion: number;
}

const RecordsPage = () => {
    const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchLegalCases = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: currentPage,
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            setLegalCases(responseData.records);
            setTotalPages(responseData.totalPages);
        } catch (error) {
            console.error("Failed to fetch legal cases:", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchLegalCases();
    }, [fetchLegalCases]);

    const legalCaseList = useMemo(() => {
        return legalCases.map((legalCase) => (
            <Link
                key={legalCase.id}
                href={`/records/${legalCase.id}`}
                className="block bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-200 cursor-pointer group"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                                {legalCase.caseTitle}
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-600 break-words">{legalCase.attorney}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-600 break-words">{legalCase.defendant}</span>
                            </div>
                        </div>
                        
                        {/* Updated Statistics */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                {legalCase.totalVersions} version{legalCase.totalVersions !== 1 ? 's' : ''}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                                {legalCase.totalFiles} file{legalCase.totalFiles !== 1 ? 's' : ''}
                            </span>
                            {legalCase.latestVersion > 0 && (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                                    v{legalCase.latestVersion}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </Link>
        ));
    }, [legalCases]);

    const previousButtonClasses = useMemo(() => {
        return `py-2 px-4 sm:py-3 sm:px-6 rounded-xl font-semibold text-white transition-all duration-200 ${currentPage === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`;
    }, [currentPage]);

    const nextButtonClasses = useMemo(() => {
        return `py-2 px-4 sm:py-3 sm:px-6 rounded-xl font-semibold text-white transition-all duration-200 ${currentPage === totalPages
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`;
    }, [currentPage, totalPages]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Document Records
                    </h1>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
                    {loading ? (
                        <div className="text-center py-8 sm:py-12">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium">Loading cases...</p>
                        </div>
                    ) : legalCases.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium">No cases found</p>
                            <p className="text-gray-500 text-sm mt-2">Start by uploading your first case documents</p>
                        </div>
                    ) : (
                        <ul className="space-y-4 sm:space-y-6">
                            {legalCaseList}
                        </ul>
                    )}

                    {/* Pagination */}
                    {!loading && legalCases.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className={previousButtonClasses}
                                disabled={currentPage === 1}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </div>
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl border border-white/20">
                                <span className="text-gray-700 text-sm sm:text-base">
                                    Page <span className="font-bold text-blue-600">{currentPage}</span> of{' '}
                                    <span className="font-bold text-purple-600">{totalPages}</span>
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                className={nextButtonClasses}
                                disabled={currentPage === totalPages}
                            >
                                <div className="flex items-center gap-2">
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordsPage;