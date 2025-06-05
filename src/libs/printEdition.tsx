// src/libs/printEdition.ts
import {
  fetchMasterEditionFromSeeds,
  mplTokenMetadata,
  printV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';
import bs58 from 'bs58';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

export const printEditionFromMaster = async (
  masterMint: string,
  recipientWallet: string
): Promise<string> => {
  const rpc_url = process.env.RPC!;

  const umi = createUmi(rpc_url)
    .use(mplTokenMetadata())


  const secretKey = bs58.decode(process.env.TREASURY!);
  const mintKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(mintKeypair));

  const masterMintPk = publicKey(masterMint);
  const recipientPk = publicKey(recipientWallet);
  const editionMint = generateSigner(umi);

  const masterEdition = await fetchMasterEditionFromSeeds(umi, {
    mint: masterMintPk,
  });

  const tx = await printV1(umi, {
    masterTokenAccountOwner: umi.identity,
    masterEditionMint: masterMintPk,
    editionMint,
    editionTokenAccountOwner: recipientPk,
    editionNumber: masterEdition.supply + 1n,
    tokenStandard: TokenStandard.ProgrammableNonFungible,
  }).sendAndConfirm(umi);

  return editionMint.publicKey.toString();
};
