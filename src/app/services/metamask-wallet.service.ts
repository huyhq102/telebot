// import { Injectable } from '@angular/core';
// import Web3 from 'web3';
// import detectEthereumProvider from '@metamask/detect-provider';

// declare let window: any;


// @Injectable({
//     providedIn: 'root'
// })
// export class MetamaskWalletService {
//     private KEY = 'WalletAddress'

//     private account;
//     private web3!: Web3;
//     provider: any;

//     constructor() {
//         if (localStorage.getItem(this.KEY)) {
//             this.account = localStorage.getItem(this.KEY)
//         }
//         this.initWeb3()
//     }
//     private async initWeb3() {
//         this.provider = await detectEthereumProvider();
//         if (this.provider) {
//             this.web3 = new Web3(this.provider);
//         } else {
//             alert('No Ethereum provider detected');
//         }
//     }

//     public async connectWallet(): Promise<void> {
//         window.open('https://metamask.app.link/dapp/https://telebot-test.studihub.io/xoCOhvJDO1hntoxS9YuLaiKTjDnuZD/undefined', '_blank')

//         if (!this.provider) {
//             alert('No provider available');
//             return;
//         }
//         try {
//             // window.open('https://metamask.app.link/dapp/https://telebot-test.studihub.io/connectxoCOhvJDO1hntoxS9YuLaiKTjDnuZD/undefined', '_blank')

//             await this.provider.request({ method: 'eth_requestAccounts' });
//             const accounts = await this.web3.eth.getAccounts();
//             this.account = accounts[0];

//             alert('Wallet connected' + accounts[0]);
//         } catch (error) {
//             alert('Failed to connect wallet');
//         }
//     }

//     public getWeb3Instance(): Web3 | undefined {
//         return this.web3;
//     }

//     async loginCoin98Wallet() {

//         this.connectWallet().then(() => {
//             console.log('Wallet connection process initiated');

//         });

//     }
//     async verifyAccount() {
//         if (this.account) {
//             // Sign a message
//             const message = "Sign in to Studihub.io";
//             const signature = await this.web3.eth.personal.sign(message, this.account, '');

//             // Send the address and the signature to your server for verification
//             // console.log("Account:", account);
//             // console.log("Signature:", signature);

//             localStorage.setItem(this.KEY, this.account)

//             // const balance = await web3.eth.getBalance(account);
//             // console.log('Balance::', web3.utils.fromWei(balance, 'ether')); // Convert balance from Wei to Ether

//             // const accounts = await web3.eth.getAccounts();

//             // studihub-acc-test
//             // final cup rib ramp diesel focus pitch angry unlock artwork hungry odor

//             // Account: 0x96B2682924790507268eCA6E7Db1625122C75b99
//             // Signature: 0xa1720b2f391115626569a093b20a87b97c38e96a4f3ca3eece60a7f3becfd7c160d0e6f4057cb9424de5df48ef70b87c6d7e1bcfe6f03d4d11e44d23de4f5d651c

//             // You can now send the `account` and `signature` to your backend for verification
//             // For example, using fetch:
//             /*
//             fetch('/api/verify-signature', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ account, signature })
//             }).then(response => {
//                 // Handle response
//             });
//             */
//         }

//     }
//     async getAccount(): Promise<string | undefined | null> {
//         // const accounts = await this.web3.eth.getAccounts();
//         return this.account;
//     }

//     async getBalance(): Promise<string> {
//         if (this.account) {
//             const balance = await this.web3.eth.getBalance(this.account);
//             return this.web3.utils.fromWei(balance, 'ether'); // Convert balance from Wei to Ether
//         }
//         return '0'
//     }

//     async logout() {
//         localStorage.removeItem(this.KEY)
//     }
// }
