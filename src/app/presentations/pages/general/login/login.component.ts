import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseService } from '../../../../core/services/baseService/base-service.service';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  constructor(private fb: FormBuilder, private baseService: BaseService, private messageService: MessageService, private router: Router, private localStorageService: LocalStorageService) {
    // Initialisation du formulaire
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.localStorageService.getToken()) {
      const token = this.localStorageService.decodeToken(this.localStorageService.getToken()!);
      if (token.role === 'admin') {
        this.router.navigate(['admin/home']);
      }
      else if(token.role === 'amazone'){
        this.router.navigate(['amazone/home']);
      }
    }
  }
  // Méthode pour gérer la soumission du formulaire
  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.baseService.postWithoutToken('token/', this.loginForm.value).subscribe((response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Connexion reussie' });
        this.localStorageService.saveToken(response.access);
        this.localStorageService.saveRefresh(response.refresh);
        const token = this.localStorageService.decodeToken(response.access);
        if (token.role === 'amazone') {
          this.router.navigate(['amazone/home']);
        } else if (token.role === 'admin') {
          this.router.navigate(['admin/home']);
        }
        this.isLoading = false;
        this.loginForm.reset();
      },(error)=>{
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Connexion échouée' })
        this.isLoading = false;
      }

    )
    }
  }
}
