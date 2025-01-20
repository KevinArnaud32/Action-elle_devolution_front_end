import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseService } from '../../../../../core/services/baseService/base-service.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environmentDev';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  step = 1;
  formSubscription!: FormGroup;
  categories: any


  constructor(
    private baseService: BaseService,
    private messageService: MessageService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.loadForm()
  }
  loadForm(){
    this.formSubscription = this.fb.group({
      vehicle: this.fb.group({
        immatriculation: ['', Validators.required],
        couleur: ['', Validators.required],
        puissance_fiscale: [null, [Validators.required, Validators.min(1)]],
        date_premiere_mise_en_circulation: ['', Validators.required],
        category: [null, Validators.required]
      }),
      person: this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        adresse: ['', Validators.required],
        telephone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
        email: ['', [Validators.required, Validators.email]],
        ville: ['', Validators.required]
      }),
      produit: ['', Validators.required],
      statut: ['', Validators.required],
    });
    this.baseService.getAll(`${environment.endPoint.categories.list}`).subscribe(
      (response)=>{
        this.categories = response
      }
    )
  }
  // Passer à l'étape suivante
  nextStep(): void {
    if (this.step === 1 && this.formSubscription.get('vehicle')?.valid) {
      this.step++;
    } else if (this.step === 2 && this.formSubscription.get('person')?.valid) {
      this.step++;
    } else if (this.step ===3 && this.formSubscription.get('produit') && this.formSubscription.get('statut')) {
      this.step++;
    }
  }

  // Retourner à l'étape précédente
  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  // Sauvegarder les données finales
  save(): void {
    if (this.formSubscription.valid) {
      this.baseService.post(`${environment.endPoint.subscriptions.add}`, this.formSubscription.value).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Souscription enregistrée', detail: 'La souscription a bien été enregistrée' });
          this.formSubscription.reset();
          this.step = 1
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la souscription', detail: error.message });
        }
      );
    }
  }

  cancel(){
    this.formSubscription.reset();
    this.step = 1
    this.messageService.add({ severity: 'success', summary: 'Souscription annulée', detail: 'La souscription a bien été annulée' });
  }

  getFormattedJSON(): string {
    return JSON.stringify(this.formSubscription.value, null, 2);
  }
}
