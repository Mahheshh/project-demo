'use client';

import { useCourtContract } from '@/hooks/contract';
import { WalletContext } from '@/providers/WalletProvider';
import { useContext, useState } from 'react';

export default function NewCasePage() {
    const [formData, setFormData] = useState({
        caseTitle: '',
        attorney: "",
        defendant: ""
    });
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState('');
    const wallet = useContext(WalletContext);
    const { contract } = useCourtContract();
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('handleSubmit called');

        if (isCreating) {
            console.log('Already creating, returning early');
            return;
        }

        console.log('Form data:', formData);

        if (!formData.caseTitle || !formData.attorney || !formData.defendant) {
            console.log('Validation failed: missing required fields');
            setError('Please fill in all required fields');
            return;
        }

        if (!contract) {
            console.log('Contract not initialized');
            setError('Smart contract is not initialized');
            return;
        }

        try {
            console.log('Starting case creation process');
            setIsCreating(true);

            console.log('Calling contract.methods.createCase()');
            contract.methods.createCase()
                .send({ from: wallet!.address as string })
                .on("error", (err) => {
                    console.error("Transaction error:", err);
                    throw new Error("Failed to create case");
                }).on("confirmation", (params) => console.log(JSON.stringify(params)))
                .on("transactionHash", (hash) => {
                    console.log("Transaction hash:", hash);
                    setSuccessMessage(`Case Created with hash ${hash}`)
                })

            console.log('Blockchain transaction completed successfully');
            setError('');

            console.log('Making API call to /api/case/create');
            const resp = await fetch("/api/case/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('API response status:', resp.status);
            const data = await resp.json();
            console.log('API response data:', data);

            setFormData({ caseTitle: '', defendant: "", attorney: "" });
            console.log('Case created successfully - form reset');
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while creating the case.');
        } finally {
            console.log('Setting isCreating to false');
            setIsCreating(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create New Case
                    </h1>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Case Information</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm sm:text-base text-red-700 font-medium">{error}</p>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm sm:text-base text-green-700 font-medium">{successMessage}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="caseTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Case Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="caseTitle"
                                            name="caseTitle"
                                            value={formData.caseTitle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter case title"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="attorney" className="block text-sm font-medium text-gray-700 mb-2">
                                        Attorney <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="attorney"
                                            name="attorney"
                                            value={formData.attorney}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter attorney name"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="defendant" className="block text-sm font-medium text-gray-700 mb-2">
                                        Defendant <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="defendant"
                                            name="defendant"
                                            value={formData.defendant}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter defendant name"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${isCreating
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                            }`}
                                        disabled={isCreating}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isCreating ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Create Case
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="mt-6 lg:mt-8">
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 sm:p-8">
                            <div className="text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Quick Tips</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Make sure all information is accurate before creating the case. Once created, the case will be recorded on the blockchain.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}