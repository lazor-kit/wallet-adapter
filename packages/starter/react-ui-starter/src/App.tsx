import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LazkitWalletAdapter } from '@solana/wallet-adapter-lazor-kit';
import { clusterApiUrl } from '@solana/web3.js';
import type { FC, ReactNode } from 'react';
import React, { useMemo } from 'react';

export const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Lazorkit - Passkey-based Smart Wallet for Solana
             * Supports WebAuthn authentication and account abstraction
             */
            new LazkitWalletAdapter({
                dialogUrl: process.env.PORTAL_URL,
                rpcUrl: process.env.RPC_URL,
                paymasterUrl: process.env.PAYMASTER_URL,
                dialogMode: 'auto',
                debug: true,
            }),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network, endpoint]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '20px',
            padding: '40px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>Wallet Adapter Starter</h1>
            <WalletMultiButton />
            <WalletInfo />
        </div>
    );
};

const WalletInfo: FC = () => {
    const { connected, publicKey, wallet } = useWallet();
    
    if (!connected) {
        return (
            <div style={{ textAlign: 'center' }}>
                <p>Connect your wallet to get started!</p>
            </div>
        );
    }
    
    return (
        <div style={{ 
            textAlign: 'center',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px'
        }}>
            <h3>Wallet Connected!</h3>
            <p><strong>Public Key:</strong> {publicKey?.toBase58()}</p>
        </div>
    );
};
