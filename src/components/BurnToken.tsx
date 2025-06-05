import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createBurnInstruction } from "@solana/spl-token";

type BurnFoofTokenParams = {
  connection: Connection;
  walletPublicKey: string | PublicKey;
  mintAddress: string | PublicKey;
  amount?: number;
  sendTransaction: (tx: Transaction, connection: Connection) => Promise<string>;
};

// burnFoofToken laat de gebruiker zelf FOOF tokens burnen
export async function burnFoofToken({
  connection,
  walletPublicKey,
  mintAddress,
  amount = 1000000000, // aantal tokens (in smallest unit, bv. 1000000000 voor 1 token met 9 decimals)
  sendTransaction, // van wallet-adapter
}: BurnFoofTokenParams) {
  const mint = new PublicKey(mintAddress);
  const user = new PublicKey(walletPublicKey);

  console.debug("[burnFoofToken] mint:", mint.toBase58());
  console.debug("[burnFoofToken] user:", user.toBase58());
  console.debug("[burnFoofToken] amount:", amount);

  // Vind het token account van de gebruiker
  const userTokenAccount = await getAssociatedTokenAddress(mint, user);
  console.debug("[burnFoofToken] userTokenAccount:", userTokenAccount.toBase58());

  // Maak de burn instructie
  const burnIx = createBurnInstruction(
    userTokenAccount,
    mint,
    user,
    amount
  );
  console.debug("[burnFoofToken] burnIx:", burnIx);

  // Bouw de transactie
  const tx = new Transaction().add(burnIx);
  console.debug("[burnFoofToken] transaction built:", tx);

  // Laat de gebruiker ondertekenen en verzenden
  const signature = await sendTransaction(tx, connection);
  console.debug("[burnFoofToken] signature:", signature);

  return signature;
}