import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ApiService } from './api.service';
import { GlobalDataService } from './global.service';

declare let window: any;


@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private KEY = 'WalletAddress'

    private account;
    private web3!: Web3;
    userInfo: any;

    constructor(private apiService: ApiService,
        private globalDataService: GlobalDataService
    ) {
        this.userInfo = this.globalDataService.loadUserInfo();

        if (localStorage.getItem(this.KEY)) {
            this.account = localStorage.getItem(this.KEY)
        }
    }
    async removeKey() {
        localStorage.removeItem(this.KEY)
    }

    async loginCoin98Wallet() {

        if (localStorage.getItem(this.KEY)) {
            this.account = localStorage.getItem(this.KEY)
            return
        }

        if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            const provider = window['ethereum'] || window.web3.currentProvider;
            if (provider) {
                this.web3 = new Web3(provider);
                try {
                    // Request account access if needed
                    await provider.request({ method: 'eth_requestAccounts' });

                    // Get the user's wallet address
                    const accounts = await this.web3.eth.getAccounts();
                    // this.account = accounts[0];

                    this.verifyAccount(accounts[0])

                } catch (error) {
                    alert("User denied account access or there was an error signing the message");
                }
            } else {
                alert('No provider found. Install Coin98 Wallet or another compatible wallet.');
                window.open('https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en', '_blank')
            }
        } else {
            alert('No web3 provider found. Install Coin98 Wallet or another compatible wallet.');
            window.open('https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en', '_blank')
        }
    }

    async loginWalletWithProvider(name: string) {
        if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            const provider = window['ethereum'] || window.web3.currentProvider;
            if (provider) {
                this.web3 = new Web3(provider);
                try {
                    // Request account access if needed
                    await provider.request({ method: 'eth_requestAccounts' });

                    // Get the user's wallet address
                    const accounts = await this.web3.eth.getAccounts();

                    await this.verifyAccount(accounts[0])

                } catch (error) {
                    alert("User denied account access or there was an error signing the message");
                }
            } else {
                alert('No provider found. Install Coin98 Wallet or another compatible wallet.');
                window.open('https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en', '_blank')
            }
        } else {
            alert('No web3 provider found. Install Coin98 Wallet or another compatible wallet.');
            window.open('https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en', '_blank')
        }
    }

    async verifyAccount(account: any) {
        if (account) {
            // Sign a message
            const message = "Sign in to Studihub.io";
            const signature = await this.web3.eth.personal.sign(message, account, '');

            const data = {
                user_id: this.userInfo.user.id,
                address: account,
                message: message,
                signature: signature
            }

            return new Promise((resolve, reject) => {
                this.apiService.post(`verify-signature`, data, { 'Content-Type': 'application/json' }).subscribe((response: any) => {
                    this.account = account;
                    localStorage.setItem(this.KEY, account)
                    resolve(true)
                })
            })
            // await verifySignature
            // const balance = await web3.eth.getBalance(account);
            // console.log('Balance::', web3.utils.fromWei(balance, 'ether')); // Convert balance from Wei to Ether

            // const accounts = await web3.eth.getAccounts();

            // studihub-acc-test
            // final cup rib ramp diesel focus pitch angry unlock artwork hungry odor   
        }

    }
    async getAccount(): Promise<string | undefined | null> {
        return this.account;
    }

    async getBalance(): Promise<string> {
        if (this.account) {
            const balance = await this.web3.eth.getBalance(this.account);
            return this.web3.utils.fromWei(balance, 'ether'); // Convert balance from Wei to Ether
        }
        return '0'
    }

    async logout() {
        localStorage.removeItem(this.KEY)
    }
}
