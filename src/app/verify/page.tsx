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
        <div className="bg-gray-100 min-h-screen py-8 flex justify-center items-center">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-teal-700 mb-4">Verify Document</h1>

                    {result?.error && (
                        <div className="text-red-500 text-sm mb-4">
                            {result.error}
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="mb-6">
                        <div className="mb-4">
                            <label
                                htmlFor="caseNo"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Case Number
                            </label>
                            <input
                                type="number"
                                id="caseNo"
                                placeholder="Enter Case Number"
                                value={caseNo}
                                onChange={(e) => setCaseNo(e.target.value)}
                                className="block w-full text-gray-700 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="file"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Document File
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-gray-700 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Generated Hash
                            </label>
                            <div className="text-sm text-gray-600 break-all p-2 bg-gray-50 rounded-lg">
                                {file?.name || 'No file selected'}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-teal-300"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>

                    {result?.isValid !== undefined && (
                        <div className={`text-center p-4 rounded-lg ${result.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.isValid ? 'Document is valid!' : 'Document verification failed.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}