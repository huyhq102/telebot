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
            console.log(provider)
            if (provider) {
                this.web3 = new Web3(provider);
                try {
                    // Request account access if needed
                    await provider.request({ method: 'eth_requestAccounts' });

                    // Get the user's wallet address
                    const accounts = await this.web3.eth.getAccounts();
                    this.account = accounts[0];

                    console.log(this.account)
                    console.log(provider)
                    this.verifyAccount()

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
            // const provider =  window['ethereum']
            if (provider) {
                this.web3 = new Web3(provider);
                try {
                    // Request account access if needed
                    await provider.request({ method: 'eth_requestAccounts' });

                    // Get the user's wallet address
                    const accounts = await this.web3.eth.getAccounts();
                    this.account = accounts[0];

                    // console.log(this.account)
                    // console.log(provider)
                    this.verifyAccount()

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

    async verifyAccount() {
        if (this.account) {
            // Sign a message
            const message = "Sign in to Studihub.io";
            const signature = await this.web3.eth.personal.sign(message, this.account, '');

            const data = {
                user_id: this.userInfo.user.id,
                address: this.account,
                message: message,
                signature: signature

            }
            this.apiService.post(`verify-signature`, data, { 'Content-Type': 'application/json' }).subscribe((response: any) => {
                console.log(response)
            })


            localStorage.setItem(this.KEY, this.account)

            // const balance = await web3.eth.getBalance(account);
            // console.log('Balance::', web3.utils.fromWei(balance, 'ether')); // Convert balance from Wei to Ether

            // const accounts = await web3.eth.getAccounts();

            // studihub-acc-test
            // final cup rib ramp diesel focus pitch angry unlock artwork hungry odor

            // Account: 0x96B2682924790507268eCA6E7Db1625122C75b99
            // Signature: 0xa1720b2f391115626569a093b20a87b97c38e96a4f3ca3eece60a7f3becfd7c160d0e6f4057cb9424de5df48ef70b87c6d7e1bcfe6f03d4d11e44d23de4f5d651c

            // You can now send the `account` and `signature` to your backend for verification
            // For example, using fetch:
            /*
            fetch('/api/verify-signature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account, signature })
            }).then(response => {
                // Handle response
            });
            */
        }

    }
    async getAccount(): Promise<string | undefined | null> {
        // const accounts = await this.web3.eth.getAccounts();
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
