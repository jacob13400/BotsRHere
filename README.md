## WhakD Bot

### About
Bad things happen. Sometimes, they happen to you. If something does happen, you might have had secrets or revelations you wanted to share with the world. It could be a bad joke that you could never crack when you were alive, state secrets you happen to run into, documents pertaining to scams of epic proportions, or maybe you just wanted to rant about the world of its problems and insecurities, regardless for this to work you need a secure and reliable dead man's switch.

### What is a dead man's switch
A Dead man's switch is a switch which gets activated when the owner gets incapacitated due to death or loss of conciousness.

### How did we get here?
So we participated in a national level hackathon called ETH Odyssey and we decided to implement a Dead man's switch inspired from the legend John Mcafee.

### How does it work?
WhackD which we named our dead man's switch, utilizes the ETH Blockchain, Telegram and Twitter to enable you to reach out to the world posthumously and pseudo anonymously. We use a telegram bot to check up on you periodically, if you fail to check in we upload your file to an IPFS network (on Slate) and the hash of the file is uploaded to the Ethereum network. Our Twitter bot will catch that event and display it on its feed, thus letting the world know that you (referred to by a moniker of your choice) have perished and have a final something to share with the world.

### How is it different from the other dead man's switches?
WhackD focuses on the following features:
1. Reliable and immutable delivery of the payload that is the messages 
2. Pseudo-anonymous identity management
3. Decentralized implementation
These features are the ones that lack in existing implementations which cause them to be unreliable and not suitable for mass public broadcasts.

### Special Uses
WhackD is the perfect application for sending messages pseudo anonymously without having journalists and corporate powers crawling up your sleeves. If you want to have your name to be broadcasted to the public you can do it too. Also along with it can be used by people to share insecurities they have always bottled in, confront people they never could, share their love for someone and so much more, in these cases WhackD becomes a tool that allows people to leave a final immutable, perpetual piece of legacy behind for all to see, obviously pseudo anonymously.

### Tech Stack
1. NodeJS
2. MongoDb
3. Telegram
4. Slate
5. Twitter Bot (Currently not functional as our account was suspended without any reason)
6. AWS

### Get it running on your local machine
1. Add .config.json file in "/functions" with the following data
```
{
    "rpc_url": "Insert Infura Polygon RPC URL here",
    "address": "Address of your wallet",
    "private_key": "Private key of your wallet to sign and send transactions directly from the server",
    "consumer_key": "Consumer Key of Twitter Bot",
    "customer_secret": "Consumer Secret of Twitter Bot",
    "access_token": "Access Token of Twitter Bot",
    "access_token_secret": "Access Token Secret of Twitter Bot",
    "slate_auth" : "Slate Auth key to upload documents to Slate",
    "slate_url" : "https://uploads.slate.host/api/public/70b22708-768c-44af-b8ca-1c6033778cfb"
}
```
2. Add .env file in the root of the folder to connect the application with MongoDB and to authenticate the Telegram Bot
```
BOT="Telegram Bot secret key here"
DB_URI="URI of mongoDb Atlas"
```
3. Install NodeJS and run the Application!
```bash
npm install
node app.js
```

### Smart Contract Deployed
1. Polygon Network (Currently being used) 
    * [Switch.sol](https://mumbai.polygonscan.com/address/0xcad983583f0d5940b3be81d4a89db474d63c6993)
2. Goerli Network 
    * [Switch.sol](https://goerli.etherscan.io/address/0x797d2f6fd89e170fa4bda25e33cdd9e447591573)

### User ID of our Telegram Bot
Search for **@deadmanbot_bot** on telegram to use our Application.

### Slate URL 
This is the place where all the uploaded files will be accessible
[https://slate.host/whackd/whackd](https://slate.host/whackd/whackd)
