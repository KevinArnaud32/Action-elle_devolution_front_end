import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseService } from '../../../../core/services/baseService/base-service.service';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';
import { AuthGuard } from '../../../../core/guards/auth.guard';

@Component({
  selector: 'app-admin',
  imports: [RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(
    private authGuard: AuthGuard
  ) { }
  logout() {
    this.authGuard.logout()
  }

}
