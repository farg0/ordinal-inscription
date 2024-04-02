const {
  ECPair,
  createTextInscription,
  createCommitTxData,
  createRevealTx,
} = require('./ordinals-bitcoinjs');
const bitcoinjs = require('bitcoinjs-lib');
require('dotenv').config();

const secret = process.env.SECRET;
const toAddress = 'tb1qt0hhlyrng2cx6yyqt7umnknmlaqtq0xa9nqqh4';
const inputTxId =
  'fb7092aaf6365986240587719e7d150a17faf1d44406acf8e03bfcaeb347a388';
const inputIndex = 0;
const inscriptionText = 'Hello!!';

async function main() {
  const privateKey = Buffer.from(secret, 'hex');
  const keypair = ECPair.fromPrivateKey(privateKey);
  const publicKey = keypair.publicKey;

  const inscription = createTextInscription({ text: inscriptionText });
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
