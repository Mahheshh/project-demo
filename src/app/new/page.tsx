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
    const { contract } = useCourtContract();
    const wallet = useContext(WalletContext);
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCreating) return;

        if (!formData.caseTitle) {
            setError('Please fill in all required fields');
            return;
        }

        if (!contract) {
            setError('Smart contract is not initialized');
            return;
        }

        contract.events.CaseCreated({ fromBlock: 0 }).on("data", async (event) => {
            console.log("event:", event)
        })

        try {
            setIsCreating(true);
            await contract.methods.createCase()
                .send({ from: wallet!.address as string })
                .on("error", (err) => {
                    console.error("Transaction error:", err);
                    throw new Error("Failed to create case");
                })
                .on("transactionHash", (hash) => {
                    console.log("Transaction hash:", hash);
                    setSuccessMessage(`Case Created with hash ${hash}`)
                })
            setError('');
            const resp = await fetch("/api/case/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await resp.json();
            console.log(data);
            setFormData({ caseTitle: '', defendant: "", attorney: "" });
            console.log('Case created successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while creating the case.');
        } finally {
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
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="max-w-2xl container mx-auto p-6">
                <h1 className="text-2xl font-semibold text-teal-700 mb-6">Create New Case</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

                    <div>
                        <label htmlFor="caseTitle" className="block text-gray-700 font-medium mb-1">
                            Case Title *
                        </label>
                        <input
                            type="text"
                            id="caseTitle"
                            name="caseTitle"
                            value={formData.caseTitle}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="attorney" className="block text-gray-700 font-medium mb-1">
                            Attorney *
                        </label>
                        <input
                            type="text"
                            id="attorney"
                            name="attorney"
                            value={formData.attorney}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="defendant" className="block text-gray-700 font-medium mb-1">
                            Defendent *
                        </label>
                        <input
                            type="text"
                            id="defendant"
                            name="defendant"
                            value={formData.defendant}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-700"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-200"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
