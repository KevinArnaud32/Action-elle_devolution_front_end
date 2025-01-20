import { Component } from '@angular/core';
import { BaseService } from '../../../../../core/services/baseService/base-service.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environmentDev';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  simulationForm!: FormGroup;
  isSubmitting = false;
  categories: any
  simulation: any
  retour: boolean = false

  constructor(
    private fb: FormBuilder,
    private baseService: BaseService,
    private messageService : MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialisation du formulaire réactif avec les champs nécessaires
   */
  initForm(): void {
    this.simulationForm = this.fb.group({
      category: ['',Validators.required],
      puissance_fiscale: [null, [Validators.required, Validators.min(1)]],
      valeur_venale: [null, [Validators.required, Validators.min(1)]],
      valeur_neuve: [null, [Validators.required, Validators.min(1)]],
      type_produitAssurance: ['', Validators.required],
      annee_vehicule: [null, [Validators.required, Validators.min(0)]],
    });
    this.baseService.getAll(`${environment.endPoint.categories.list}`).subscribe(
      (response)=>{
        this.categories = response
      }
    )
  }

  /**
   * Soumettre le formulaire
   */
  submitForm(): void {
    if (this.simulationForm.invalid) {
      this.simulationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.baseService.post(`${environment.endPoint.simulations.add}`,this.simulationForm.value).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Simulation crée', detail: 'Simulation créée avec succès'});
        this.retour = true,
        this.simulation = response.data.details
        this.simulationForm.reset();
        this.isSubmitting = false;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de la simulation', detail: error.message});
        this.isSubmitting = false;
      }
    );
  }
}
