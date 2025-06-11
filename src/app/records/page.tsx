"use client";
import { useEffect, useState } from 'react';

interface LegalCase {
    id: number,
    caseTitle: string,
    attorney: string,
    defendant: string,
    versions: [{ hashes: string[] }]
}

const RecordsPage = () => {
    const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchLegalCases = async () => {
            const response = await fetch(`/api/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: currentPage,
                    skip: (currentPage - 1) * 10
                })
            });
            const responseData = await response.json();
            console.log(responseData);
            setLegalCases(responseData.records.map((caseRecord: LegalCase) => ({
                id: caseRecord.id,
                caseTitle: caseRecord.caseTitle,
                attorney: caseRecord.attorney,
                defendant: caseRecord.defendant,
                versions: caseRecord.versions
            })));
            setTotalPages(responseData.totalPages);
        };

        fetchLegalCases();
    }, [currentPage]);

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">
                    Document Records
                </h1>

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <ul className="space-y-4">
                        {legalCases.map((legalCase) => (
                            <li
                                key={legalCase.id}
                                className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                    const dialog = document.createElement('dialog');
                                    dialog.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto';
                                    dialog.innerHTML = `
                                        <div class="space-y-6">
                                            <div class="flex justify-between items-center border-b pb-4">
                                                <h3 class="text-2xl font-bold text-gray-800">${legalCase.caseTitle}</h3>
                                                <button onclick="this.closest('dialog').close()" 
                                                    class="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div class="space-y-4">
                                                ${legalCase.versions?.map((version, index) => `
                                                    <div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div class="font-medium text-gray-700 mb-2">Version ${index + 1}</div>
                                                        <div class="text-gray-600 text-sm break-all">
                                                            ${version.hashes.join(', ')}
                                                        </div>
                                                    </div>
                                                `).join('') || '<p class="text-gray-500">No versions available</p>'}
                                            </div>
                                        </div>
                                    `;

                                    dialog.addEventListener('click', (e) => {
                                        const dialogDimensions = dialog.getBoundingClientRect();
                                        if (
                                            e.clientX < dialogDimensions.left ||
                                            e.clientX > dialogDimensions.right ||
                                            e.clientY < dialogDimensions.top ||
                                            e.clientY > dialogDimensions.bottom
                                        ) {
                                            dialog.close();
                                        }
                                    });

                                    document.body.appendChild(dialog);
                                    dialog.showModal();
                                    dialog.addEventListener('close', () => {
                                        dialog.remove();
                                    });
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">
                                        {legalCase.caseTitle}
                                    </span>
                                    <span className="text-sm text-gray-500">{legalCase.attorney}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={`py-2 px-4 rounded-lg font-semibold text-white ${currentPage === 1
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700'
                                }`}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page <span className="font-bold">{currentPage}</span> of{' '}
                            <span className="font-bold">{totalPages}</span>
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            className={`py-2 px-4 rounded-lg font-semibold text-white ${currentPage === totalPages
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700'
                                }`}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordsPage;
