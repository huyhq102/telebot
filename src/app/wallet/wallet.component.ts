import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	standalone: true,
	styleUrls: ['./wallet.component.scss'],
	imports: [CommonModule, NgxLoadingModule, MatBottomSheetModule],
})
export class WalletComponent implements OnInit {
	
	constructor(
		private bottomSheetRef: MatBottomSheetRef<WalletComponent>
	) { }



	ngOnInit(): void {
	}

	close(): void {
    this.bottomSheetRef.dismiss(); 
  } 
}
