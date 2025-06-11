import { useState, useEffect, useContext } from "react";
import { Contract } from "web3";
import { WalletContext } from "@/providers/WalletProvider";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "caseNo",
                "type": "uint256"
            }
        ],
        "name": "CaseCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "caseNo",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "versionId",
                "type": "uint256"
            }
        ],
        "name": "DocumentAdded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "caseNo",
                "type": "uint256"
            },
            {
                "internalType": "string[]",
                "name": "hashArray",
                "type": "string[]"
            }
        ],
        "name": "addDocument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "judge",
                "type": "address"
            }
        ],
        "name": "addJudge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "cases",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "caseNo",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "createCase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "caseNo",
                "type": "uint256"
            }
        ],
        "name": "getCase",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "caseNo",
                        "type": "uint256"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "version",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string[]",
                                "name": "hashesh",
                                "type": "string[]"
                            }
                        ],
                        "internalType": "struct Court.CaseData[]",
                        "name": "data",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Court.CourtData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "judges",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export const useCourtContract = () => {
    const [contract, setContract] = useState<Contract<typeof abi> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const context = useContext(WalletContext);

    useEffect(() => {
        const init = async () => {
            if (!context) {
                return
            }
            if (!context.isConnected) {
                await context.connectWallet();
            }
            try {
                if (context.isConnected && context.signer) {
                    if (context.web3Instance) {
                        const contractInstance = new context.web3Instance.eth.Contract(abi, contractAddress);
                        setContract(contractInstance);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        };

        init();
    }, [context]);

    return { contract, error };
};