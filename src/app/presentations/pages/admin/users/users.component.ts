import { Component, inject, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environmentDev';
import { BaseService } from '../../../../core/services/baseService/base-service.service';
import { PrimeNG, PrimeNGConfigType } from 'primeng/config';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';



@Component({
  selector: 'app-users',
  imports: [TableModule, IconFieldModule, FormsModule, CommonModule, InputIconModule, InputTextModule, DropdownModule, DialogModule, ButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users!: any[];
  filteredUsers!: any[];
  statusFilter!: string;
  loading: boolean = false;
  userNumber: number = 0;
  selectedUser!: any;
  baseService = inject(BaseService);
  messageService = inject(MessageService);
  @ViewChild('dt2') dt2!: Table;
  statusOptions = [
    { label: 'Tous', value: '' },
    { label: 'Activés', value: 'active' },
    { label: 'Désactivés', value: 'inactive' }
  ];
  visible: boolean = false;
  motifForm!: FormGroup; // Declare the form group for motif

  constructor(
    private primengConfig: PrimeNG,
    private fb: FormBuilder,
    private localService: LocalStorageService,
    private confirmationService: ConfirmationService
  ) {
    this.primengConfig.setTranslation({
      startsWith: 'Commence par',
      contains: 'Contient',
      notContains: 'Ne contient pas',
      endsWith: 'Se termine par',
      equals: 'Égal à',
      notEquals: 'Différent de',
      noFilter: 'Aucun filtre'
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Create the form group for the motif field
  loadUsers() {
    this.baseService.getAll(`${environment.endPoint.users.list}`).subscribe((data) => {
      this.users = data.filter((user: any) => user.id !== this.localService.decodeToken(localStorage.getItem('jwt_token')!).user_id && user.role !== 'admin');
      this.filteredUsers = [...this.users];
      console.log(this.filteredUsers);

      this.userNumber = this.filteredUsers.length;
    });
  }

  filterUsers() {
    if (this.statusFilter === 'active') {
      this.filteredUsers = this.users.filter((user) => user.is_active);
      this.userNumber = this.filteredUsers.length;
    } else if (this.statusFilter === 'inactive') {
      this.filteredUsers = this.users.filter((user) => !user.is_active);
      this.userNumber = this.filteredUsers.length;
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  viewClientDetails(user: any) {
    this.selectedUser = user;
  }

  filterGlobalValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.dt2.filterGlobal(input.value, 'contains');
    }
  }

  showDialog(user: any) {
    this.selectedUser = user;
    this.visible = !this.visible;
    if (!this.visible) {
      const message = this.selectedUser.is_active ? 'Désactivation annulée' : 'Activation annulée';
      this.messageService.add({ severity: 'error', summary: 'Annulation', detail: message });
      this.motifForm.reset();
    }
  }

  confirm($event: MouseEvent, user: any) {
    const selectedUser = user
    const message = selectedUser.is_active ? 'Désactivation annulée' : 'Activation annulée';
    const confirmatiomMessage = selectedUser.is_active ? 'Voulez-vous vraiment desactiver cet Utilisateur?' : 'Voulez-vous vraiment activer cet Utilisateur?';
    const confirmatiomTitle = selectedUser.is_active ? 'Desactiver' : 'Activer';
    const acceptMessage = selectedUser.is_active ? 'Utilisateur desactivé avec succes' : 'Utilisateur activé avec succes';
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: confirmatiomMessage,
      header: confirmatiomTitle,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger',
      },

      accept: () => {
        const userData = { ...selectedUser, is_active: !selectedUser.is_active };
        this.baseService.edit(`${environment.endPoint.users.edit}`, selectedUser.id, userData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'info', summary: 'Confirmer', detail: acceptMessage });
            this.loadUsers();
          }
        );
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejecter', detail: message });
      },
    });
  }

}

