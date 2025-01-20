import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LocalStorageService } from './core/services/localStorage/local-storage.service';
import { ConfirmDialog } from 'primeng/confirmdialog';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {
  title = 'actionelles-front';
  localStorageService = inject(LocalStorageService);
  router = inject(Router)

  ngOnInit(): void {

  }

}
