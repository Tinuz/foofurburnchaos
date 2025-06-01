import { Connection, PublicKey } from '@solana/web3.js';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export const getWalletBalance = async (walletAddress: string): Promise<number> => {
    try {
        const publicKey = new PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
    }
};

export const getWalletInfo = async (walletAddress: string) => {
    // Placeholder for additional wallet info retrieval logic
    return {
        address: walletAddress,
        balance: await getWalletBalance(walletAddress),
    };
};