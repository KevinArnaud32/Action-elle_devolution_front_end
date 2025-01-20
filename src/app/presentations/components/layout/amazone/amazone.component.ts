import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';

@Component({
  selector: 'app-amazone',
  imports: [RouterModule],
  templateUrl: './amazone.component.html',
  styleUrl: './amazone.component.css'
})
export class AmazoneComponent {

  constructor(
    private localService: LocalStorageService,
    private router: Router,
    private authGuard: AuthGuard
  ){}
  ngOnInit(){
    if (this.localService.getToken()) {
      const token = this.localService.decodeToken(this.localService.getToken()!);
      if (token.role === 'admin') {
        this.router.navigate(['admin/home']);
      }
      else if(token.role === 'amazone') {
        this.router.navigate(['amazone/home']);
      }
    }
  }


  logout() {
    this.authGuard.logout();
  }

}
