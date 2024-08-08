import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { GlobalDataService } from '../services/global.service';
import { WalletService } from '../services/wallet.service';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	standalone: true,
	styleUrls: ['./wallet.component.scss'],
	imports: [CommonModule, NgxLoadingModule, MatBottomSheetModule],
})
export class WalletComponent implements OnInit {
	userInfo: any;

	constructor(
		private bottomSheetRef: MatBottomSheetRef<WalletComponent>,
		private globalDataService: GlobalDataService,
		private walletService: WalletService,
	) { }



	ngOnInit(): void {
		this.userInfo = this.globalDataService.loadUserInfo();

	}

	close(): void {
		this.bottomSheetRef.dismiss();
	}

	connect(walletName: string) {
		const dappConnectLink = `https://telebot-test.studihub.io/connect/${this.userInfo.user.id}`

		// this.walletService.loginWalletWithProvider('MetaMask').then(async () => {
		// 	console.log('okkk')
		// 	// this.walletAddress = account ? account : this.walletAddress
		// })
		switch (walletName) {
			case 'MetaMask':
				window.open(`https://metamask.app.link/dapp/${dappConnectLink}`, '_blank')
				break;
			case 'Gate Wallet':
				window.open(`https://gateio.onelink.me/DmA6/web3?dapp_url=${encodeURIComponent(dappConnectLink)}`, '_blank')
				break;
			case 'Bitget Wallet':
				window.open(`https://bkcode.vip/?action=dapp&url=${encodeURIComponent(dappConnectLink)}`, '_blank')
				break;
			case 'OKX Wallet':
				window.open(`https://www.okx.com/download?deeplink=okx%3A%2F%2Fwallet%2Fdapp%2Furl%3FdappUrl%3D${encodeURIComponent(dappConnectLink)}`)
				break;
		}
	}
}
