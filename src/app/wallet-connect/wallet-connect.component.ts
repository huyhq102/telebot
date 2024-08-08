import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Web3 from 'web3';


declare let window: any;

@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss']
})
export class WalletConnectComponent implements OnInit {
  private id: string | null | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    alert(this.id)

    this.connectMetaMask()
  }

  async connectMetaMask() {
    try {
      const provider = window['ethereum'] || window.web3.currentProvider;
      const web3 = new Web3(provider);

      // Request accounts from MetaMask
      await provider.request({ method: 'eth_requestAccounts' });

      // Get the user's wallet address
      const accounts = await web3.eth.getAccounts();
      // account = accounts[0];
      alert('accoutn ' + accounts[0])
      // console.log('Connected accounts:', accounts);
    } catch (error) {
      alert('Error connecting to MetaMask:');
    }
  };
  
}
