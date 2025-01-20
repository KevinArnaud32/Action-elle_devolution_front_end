import { providePrimeNG } from 'primeng/config';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, Subscription, interval } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BaseService } from '../services/baseService/base-service.service';
import { environment } from '../../../environments/environmentDev';
import { LocalStorageService } from '../services/localStorage/local-storage.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  private tokenCheckSubscription: Subscription | null = null;
  private intervalTime = 5 * 60 * 1000;
  private messageService = inject(MessageService);

  constructor(private router: Router, private baseService: BaseService, private localService: LocalStorageService) {
    this.startTokenCheck();
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const token = localStorage.getItem('jwt_token');
    const decode_token = this.localService.decodeToken(token!);
    if (!decode_token) {
      this.redirectToLogin('Session expirée, veuillez vous reconnecter');
      return of(false);
    }
    const role = decode_token.role;
    const expectedRoles = route.data['roles'];

    if (!token) {
      this.redirectToLogin('Session expirée, veuillez vous reconnecter');
      return of(false);
    }

    return this.baseService.postWithoutToken(`${environment.endPoint.verify}`, {token}).pipe(
      switchMap(() => this.checkAccess(expectedRoles, role)),
      catchError(() => this.handleTokenRefresh(expectedRoles, role))
    );
  }

  private checkAccess(expectedRoles: string[], role: string): Observable<boolean> {
    if (expectedRoles && expectedRoles.includes(role)) {
      return of(true);
    } else {
      this.handleRoleRedirect(role);
      return of(false);
    }
  }

  private handleTokenRefresh(expectedRoles: string[], role: string): Observable<boolean> {
    const refresh = localStorage.getItem('refresh');
    return this.baseService.postWithoutToken(`${environment.endPoint.refresh}`, {refresh}).pipe(
      switchMap(() => this.checkAccess(expectedRoles, role)),
      catchError(() => {
        this.logout();
        this.router.navigate(['']);
        return of(false);
      })
    );
  }

  private startTokenCheck() {
    this.tokenCheckSubscription = interval(this.intervalTime).subscribe(() => {
      const token = localStorage.getItem('jwt_token');
      const refresh = localStorage.getItem('refresh');
      if (token) {
        this.baseService.postWithoutToken(`${environment.endPoint.verify}`, {token}).pipe(
          catchError(() => this.baseService.postWithoutToken(`${environment.endPoint.refresh}`, refresh))
        ).subscribe({
          error: () => {
            this.logout();
            this.router.navigate(['']);
          }
        });
      }
    });
  }

  private handleRoleRedirect(role: string) {
    const redirectMap: { [key: string]: string } = {
      freelancer: 'offres',
      client: '/dashboard',
      admin: 'back-office/dashboard'
    };
    const redirectRoute = redirectMap[role] || '';
    console.log(`Redirecting to ${redirectRoute}`);
    this.router.navigate([redirectRoute]);
  }

  private redirectToLogin(message: string) {
    // Affichage d'un message avec MessageService
    this.messageService.add({ severity: 'warn', summary: 'Déconnexion', detail: message });
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.tokenCheckSubscription?.unsubscribe();
  }

  logout() {
    this.localService.destroyToken();
    this.localService.destroyRefresh();
    this.messageService.add({ severity: 'info', summary: 'Déconnexion', detail: 'Vous avez été déconnecté avec succès.' });
    this.router.navigate(['']);
  }
}
