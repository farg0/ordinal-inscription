const {
  ECPair,
  createTextInscription,
  createCommitTxData,
  createRevealTx,
} = require('./ordinals-bitcoinjs');
const bitcoinjs = require('bitcoinjs-lib');

const secret = '';
const toAddress = 'tb1q5eja48z06hcgdqtmahxhegdp8nys84997szfjf';
const inputTxId =
  'af348cf9eac6b2a25000873549bb7ec1bdf5ec674c4212accd03778259c26355';
const inputIndex = 4;

async function main() {
  const privateKey = Buffer.from(secret, 'hex');
  const keypair = ECPair.fromPrivateKey(privateKey);
  const publicKey = keypair.publicKey;

  const inscription = createTextInscription({ text: 'Hello!!' });
  const commitTxData = createCommitTxData({
    publicKey,
    inscription,
  });

  const padding = 549;
  const txSize = 600 + Math.floor(inscription.content.length / 4);
  const feeRate = 2;
  const minersFee = txSize * feeRate;

  const requiredAmount = 550 + minersFee + padding;

  const commitTxResult = {
    txId: inputTxId,
    sendUtxoIndex: inputIndex,
    sendAmount: requiredAmount,
  };

  const revelRawTx = await createRevealTx({
    commitTxData,
    commitTxResult,
    toAddress,
    privateKey,
    amount: padding,
  });
  console.log(` create reveal rawtx ${revelRawTx.rawTx}`);
}

main().catch();
