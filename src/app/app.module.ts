import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { GlobalDataService } from './services/global.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
		NgxLoadingModule.forRoot({}),
		BrowserAnimationsModule,
  ],
  providers: [GlobalDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
