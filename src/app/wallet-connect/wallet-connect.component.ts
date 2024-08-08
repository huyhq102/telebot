import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Web3 from 'web3';
import { ApiService } from '../services/api.service';


declare let window: any;

@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss']
})
export class WalletConnectComponent implements OnInit {
  private id: string | null | undefined;
  walletAddress: any
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    // alert(this.id)

    this.connectWallet()
  }

  async connectWallet() {
    try {
      const provider = window['ethereum'] || window.web3.currentProvider;
      const web3 = new Web3(provider);

      // Request accounts from MetaMask
      await provider.request({ method: 'eth_requestAccounts' });

      // Get the user's wallet address
      const accounts = await web3.eth.getAccounts();
      // account = accounts[0];
      // alert('accoutn ' + accounts[0])
      this.walletAddress = accounts[0]

      const message = "Sign in to Studihub.io";
      const signature = await web3.eth.personal.sign(message, this.walletAddress, '');

      const data = {
        userId: this.id,
        address: this.walletAddress,
        message: message,
        signature: signature,
      }

      this.apiService.post(`verify-signature`, data, { 'Content-Type': 'application/json' }).subscribe((response: any) => {
        // alert(JSON.stringify(response))
      })
      // console.log('Connected accounts:', accounts);
    } catch (error:any) {
      // alert('Error connecting to MetaMask:'+ error.message);
    }
  };

}
