import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BaseService } from '../../../../../core/services/baseService/base-service.service';
import { LocalStorageService } from '../../../../../core/services/localStorage/local-storage.service';
import { environment } from '../../../../../../environments/environmentDev';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-list',
  imports: [TableModule, CommonModule, ButtonModule, DialogModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: []
})
export class ListComponent {

  simulations !: any[];
  simulation: any;
  detail: boolean = false;

  first = 0;

  rows = 10;

  constructor(
    private baseService: BaseService,
    private localService: LocalStorageService
  ) { }

  ngOnInit() {
    this.baseService.getAll(`${environment.endPoint.simulations.list}`).subscribe(
      response => {
        console.log(response);

        this.simulations = response.filter((item: any) => item.user === this.localService.decodeToken(localStorage.getItem('jwt_token')!).user_id)
      }
    );
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.simulations ? this.first + this.rows >= this.simulations.length : true;
  }

  isFirstPage(): boolean {
    return this.simulations ? this.first === 0 : true;
  }

  voirDetail(simulation: any) {
    this.baseService.getOne(`${environment.endPoint.simulations.list}`, simulation.id).subscribe(
      (response) => {
        this.simulation = response; // Stocker la réponse dans la variable simulation
        this.detail = true; // Ouvrir le modal
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails:', error);
      }
    );
  }

}
