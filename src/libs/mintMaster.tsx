// src/libs/mintMaster.ts
import {
  createProgrammableNft,
  mplTokenMetadata,
  printSupply,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createGenericFile,
  generateSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { base58 } from '@metaplex-foundation/umi/serializers';
import bs58 from 'bs58';
import { keypairIdentity } from '@metaplex-foundation/umi';
import fs from 'fs';
import path from 'path';

export const createMasterNft = async () => {
  const rpc_url = process.env.RPC || 'https://mainnet.helius-rpc.com/?api-key=a360743f-773d-430c-afcd-70370fd20b87';

  const umi = createUmi(rpc_url)
    .use(mplTokenMetadata())
    .use(irysUploader({ address: 'https://node1.irys.xyz' }));

  const secretKey = bs58.decode(process.env.TREASURY!);
  const mintKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(mintKeypair));

  const imageFile = fs.readFileSync(
    path.join(process.cwd(), 'public/images/nfts/clown.png')
  );
  const umiImageFile = createGenericFile(imageFile, 'clown.png', {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  });

  const imageUri = await umi.uploader.upload([umiImageFile]);
  const metadata = {
    name: 'Foofur the Clown',
    description: 'A haunting self-portrait of Foofur in full clown regalia.',
    image: imageUri[0],
    external_url: 'https://foofur.com',
    attributes: [{ trait_type: 'Costume', value: 'Clown' },
    { trait_type: "Expression", value: "Existential Dread" },
    { trait_type: "Smell", value: "Greasepaint & Tears" },
    { trait_type: "Chaos Level", value: "11/10" },],
    properties: {
      files: [{ uri: imageUri[0], type: 'image/png' }],
      category: 'image',
    },
  };

  const metadataUri = await umi.uploader.uploadJson(metadata);
  const nftSigner = generateSigner(umi);

  const tx = await createProgrammableNft(umi, {
    mint: nftSigner,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: metadata.name,
    uri: metadataUri,
    printSupply: printSupply('Limited', [100]),
  }).sendAndConfirm(umi);

  return {
    signature: base58.deserialize(tx.signature)[0],
    nftUrl: `https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`,
    mint: nftSigner.publicKey.toString(),
  };
};
