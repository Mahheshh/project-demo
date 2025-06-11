"use client";
import { useCourtContract } from '@/hooks/contract';
import generateHash from '@/lib/hashGenerator';
import { WalletContext } from '@/providers/WalletProvider';
import { useContext, useState } from 'react';

const Upload = () => {
    const [file, setFile] = useState<File[]>([]);
    const [fileHash, setFileHash] = useState<string[]>([]);
    const [caseNo, setCaseNo] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const hashes = await Promise.all(fileList.map(file => generateHash(file)));
        setFileHash(hashes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isUploading) {
            return;
        }
        try {
            setIsUploading(true);
            contract?.methods.addDocument().send({ from: wallet?.address as string })
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caseNo: parseInt(caseNo),
                    hashList: fileHash
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Upload failed');
                return;
            }

            setFile([]);
            setFileHash([]);
            setCaseNo('');
            setError('');
            setDocuments([]);
            alert('Files uploaded successfully!');

        } catch (err) {
            setError(`Failed to upload files ${err}`);
        } finally {
            setIsUploading(false)
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 flex justify-center items-center">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-teal-700 mb-4">Upload Document</h1>

                    {error && (
                        <div className="text-red-500 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mb-6">
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
                                Select Files
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                className="block w-full text-gray-700 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                                required
                                multiple
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700"
                            disabled={isUploading}
                        >
                            Upload
                        </button>
                    </form>

                    {documents.length > 0 && (
                        <div>
                            <h2 className="text-xl text-teal-700 font-bold mb-4">
                                Associated Documents
                            </h2>
                            <ul className="space-y-4">
                                {documents.map((doc, idx) => (
                                    <li
                                        key={idx}
                                        className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <span className="text-gray-700 font-semibold">
                                            {doc.filename}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upload;
