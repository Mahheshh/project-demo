"use client";

import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { Web3 } from "web3";

interface WalletContextProps {
  web3Instance: Web3 | null;
  address: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

export const WalletContext = createContext<WalletContextProps | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // State management for wallet connection
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert(
          "MetaMask is not installed. Please install it to use this feature."
        );
        return;
      }
      setWeb3Instance(new Web3(window.ethereum));
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const signerInstance = await web3Provider.getSigner();
      const userAddress = await signerInstance.getAddress();

      setProvider(web3Provider);
      setSigner(signerInstance);
      setAddress(userAddress);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
  };

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (window.ethereum) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setProvider(web3Provider);
            setSigner(await web3Provider.getSigner());
            setAddress(accounts[0].address);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  const contextValue: WalletContextProps = {
    web3Instance,
    address,
    connectWallet,
    disconnectWallet,
    provider,
    signer,
    isConnected,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
