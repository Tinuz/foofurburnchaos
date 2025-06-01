import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';

const network = WalletAdapterNetwork.Devnet;
const endpoint = 'https://api.devnet.solana.com';

const WalletConnect: React.FC = () => {
    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
        onSelectWallet(walletName: string): void;
        wallets: any[];
    }> | null>(null);

    const { buttonState, onConnect, onDisconnect, onSelectWallet, publicKey } = useWalletMultiButton({
        onSelectWallet: setWalletModalConfig,
    });

    let label;
    switch (buttonState) {
        case 'connected':
            label = `Connected: ${publicKey?.toString()}`;
            break;
        case 'connecting':
            label = 'Connecting...';
            break;
        case 'disconnecting':
            label = 'Disconnecting...';
            break;
        case 'has-wallet':
            label = 'Connect Wallet';
            break;
        case 'no-wallet':
            label = 'Select Wallet';
            break;
    }

    return (
        <button
            className="bg-blue-500 text-white p-2 rounded"
            disabled={buttonState === 'connecting' || buttonState === 'disconnecting'}
            onClick={() => {
                switch (buttonState) {
                    case 'connected':
                        onDisconnect?.();
                        break;
                    case 'has-wallet':
                        onConnect?.();
                        break;
                    case 'no-wallet':
                        onSelectWallet?.();
                        break;
                }
            }}
        >
            {label}
        </button>
    );
};

const App: React.FC = () => {
    return (
        <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
            <WalletConnect />
        </WalletProvider>
    );
};

export default App;