import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxLoadingModule } from 'ngx-loading';
import Swal from 'sweetalert2'
import { ApiService } from '../services/api.service';
import { GlobalDataService } from '../services/global.service';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	standalone: true,
	styleUrls: ['./modal.component.scss'],
	imports: [CommonModule, NgxLoadingModule, MatBottomSheetModule],
})
export class ModalComponent implements OnInit {
	isChecking = false;

	userInfo: any;

	userPoint: any;
	listUsers: any;
	
	totalPoints: any;
	totalHolder: any

	public loading: boolean = false;
	constructor(
		private apiService: ApiService,
		private router: Router,
		private globalDataService: GlobalDataService,
		private bottomSheetRef: MatBottomSheetRef<ModalComponent>
	) { }



	ngOnInit(): void {
	}

	close(): void {
    this.bottomSheetRef.dismiss(); 
  } 
}
