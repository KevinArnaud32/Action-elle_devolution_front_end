import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BaseService } from '../../../../core/services/baseService/base-service.service';
import { environment } from '../../../../../environments/environmentDev';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';
@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatToolbarModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  num_simulations!: number;
  num_subscriptions!: number;

  constructor(
    private baseService: BaseService,
    private localService: LocalStorageService
  ) { }
  ngOnInit(): void {
    this.baseService.getAll(`${environment.endPoint.simulations.list}`).subscribe(
      response => {
          this.num_simulations = response.length
      }
    );
    this.baseService.getAll(`${environment.endPoint.subscriptions.list}`).subscribe(
      response => {
        this.num_subscriptions = response.length
      }
    );
  }

}
