var Web3 = require('web3');
var fs = require('fs');
var Contract = require('web3-eth-contract');
var request = require('request');
const config = require("./.config.json");
var Tx = require('ethereumjs-tx');
var Common = require('ethereumjs-common').default;
var builtContract = require('../contracts/build/contracts/Switch.json');
var Twit = require('twit');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');


//twitter config
var T = new Twit({
    consumer_key:         config.consumer_key,
    consumer_secret:      config.customer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret
})

const customCommon = Common.forCustomChain(
    'mainnet',
    {
      name: 'Mumbai',
      networkId: 1,
      chainId: 80001,
    },
    'petersburg'
  )
  

//infura config
const rpcURL = config.rpc_url;
var web3 = new Web3(rpcURL);

//account related
const account = config.address;
const privateKey = config.private_key;
const privateKeyBuffer = Buffer.from(privateKey, 'hex');
const contractAddress = builtContract["networks"]["80001"]["address"];
const contractABI = builtContract.abi;


var contract = new Contract(contractABI,contractAddress);

const upload = async(userName, fileUrl) => {
    const fileExt = fileUrl.split('.').pop();
    const fileName = `${userName}.${fileExt}`;

    const url = config.slate_url;
    filepath = `${userName}.pdf`;

    const formData = new FormData();
    formData.append('data', fs.createReadStream(`./tempFolder/${fileName}`));

    const res = await axios.post(url, formData, {
        headers: {
            ...formData.getHeaders(),
            Authorization: config.slate_auth // API key
        }
    });

    // console.log(typeof(res));
    return res.data.data.cid;
}

const addData = async(name, hash) => {
    //function ABI
    const myData = contract.methods.addData(name, hash).encodeABI();
    console.log(myData)

    // transaction count
    const transactionCount = await web3.eth.getTransactionCount(account);
    console.log(transactionCount);

    // Transaction Object
    const txObject = {
        nonce:    web3.utils.toHex(transactionCount),
        to:       contractAddress,
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gasLimit: web3.utils.toHex(2100000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
        data: myData  
    }

    // sign
    const tx = new Tx.Transaction(txObject,  { common: customCommon });
    tx.sign(privateKeyBuffer);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    // Broadcast the transaction
    try {
        const transaction = await web3.eth.sendSignedTransaction(raw);
        console.log(transaction);
        console.log(transaction['transactionHash']);
        // T.post('statuses/update', { status: `Dead Man's Switch Activated! \n\nName:${name}\nHash:${hash}` }, function(err, data, response) {
        //     console.log(data)
        // })
    } catch(e) {
        message.reply("Transaction error!")
    }

    return 0;
}


const downloadFile = async(userName, fileUrl) => {
    try {
        const url = fileUrl;
        const fileExt = fileUrl.split('.').pop();
        const fileName = `${userName}.${fileExt}`;
        /* Using Promises so that we can use the ASYNC AWAIT syntax */       
        /* Create an empty file where we can save data */
        let file = fs.createWriteStream(`./tempFolder/${fileName}`); 
        await new Promise((resolve, reject) => {
            let stream = request({
                /* Here you should specify the exact link to the file you are trying to download */
                uri: url,
            })
            .pipe(file)
            .on('finish', () => {
                console.log(`The file finished downloading.`);
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            })
        })
        return true;        
    }
    catch(e) {
        console.error(e);
    }
}

const deleteFile = async (userName, fileUrl) => {
    const url = fileUrl;
    const fileExt = fileUrl.split('.').pop();
    const fileName = `${userName}.${fileExt}`;

    try {
        fs.unlinkSync(`./tempFolder/${fileName}`);
        console.log("File is deleted.");
    } catch (error) {
        console.log(error);
    }    
}

const uploadAndTweet = async(userName, fileUrl) => {
    try{
        const downloadRes = await downloadFile(userName, fileUrl);
        const uploadRes = await upload(userName, fileUrl);
        const writeRes = await addData(userName, uploadRes);
        const deleteRes = await deleteFile(userName, fileUrl);
    } catch(e){
        console.error(e);
    }
}

module.exports = uploadAndTweet;



