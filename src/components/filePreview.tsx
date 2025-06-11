import React, { useMemo, useCallback } from 'react';

interface FilePreviewProps {
    selectedFile: {
        dataSource: string;
        fileName: string;
    };
    poppins: { className: string };
}

const FilePreview: React.FC<FilePreviewProps> = React.memo(({ selectedFile, poppins }) => {
    const createBlobUrl = useCallback((base64String: string) => {
        const parts = base64String.match(/^data:(.*?);base64,(.*)$/);
        if (!parts) return null;

        const [, mimeType, base64Data] = parts;
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes.buffer], { type: mimeType });
        return URL.createObjectURL(blob);
    }, []);

    const blobUrl = useMemo(() =>
        createBlobUrl(selectedFile.dataSource),
        [selectedFile.dataSource, createBlobUrl]
    );

    const previewTitle = useMemo(() =>
        `Preview of ${selectedFile.fileName}`,
        [selectedFile.fileName]
    );

    if (blobUrl) {
        return (
            <div className="w-full h-full">
                <iframe
                    src={blobUrl}
                    className="w-full h-96 border-0 rounded-lg shadow-lg bg-white"
                    title={previewTitle}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            <p className={`${poppins.className} text-lg font-semibold text-gray-700 mb-2`}>
                Preview Unavailable
            </p>
            <p className="text-sm text-gray-500">
                Could not load preview for this file type
            </p>
        </div>
    );
});

FilePreview.displayName = 'FilePreview';

export default FilePreview;