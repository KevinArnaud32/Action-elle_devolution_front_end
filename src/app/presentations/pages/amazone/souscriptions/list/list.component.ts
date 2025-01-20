import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { environment } from '../../../../../../environments/environmentDev';
import { BaseService } from '../../../../../core/services/baseService/base-service.service';
import { LocalStorageService } from '../../../../../core/services/localStorage/local-storage.service';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-list',
  imports: [DialogModule, TableModule, CommonModule, ButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  subscriptions !: any[];
  subscription: any;
  detail: boolean = false;

  first = 0;

  rows = 10;

  constructor(
    private baseService: BaseService,
    private localService: LocalStorageService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.baseService.getAll(`${environment.endPoint.subscriptions.list}`).subscribe(
      response => {
        console.log(response);

        this.subscriptions = response.filter((item: any) => item.user === this.localService.decodeToken(localStorage.getItem('jwt_token')!).user_id)
      }
    );
  }
  voirDetail(subscription: any) {
    this.subscription = subscription;
    this.detail = true;
  }
  voirAttestation(subscription: any) {
    this.baseService.getDetail(`${environment.endPoint.subscriptions.retrieve}`, 'attestation', subscription.id).subscribe(
      (response: any) => {
        const data = response;

        const doc = new jsPDF();
        const verificationUrl = `${environment.baseUrl}/${environment.endPoint.subscriptions.retrieve}attestation/${data.id}`;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Attestation de Souscription', 20, 20);

        // Ajouter les informations de la souscription
        doc.setFontSize(12);
        doc.text(`Attestation: ${data.numero_attestation}`, 20, 40);
        doc.text(`Nom et prénom: ${data.person.nom} ${data.person.prenom}`, 20, 50);
        doc.text(`Produit: ${data.produit}`, 20, 60);
        doc.text(`Date de souscription: ${new Date(data.date_souscription).toLocaleDateString()}`, 20, 70);

        doc.text('Véhicule:', 20, 90);
        doc.text(`Immatriculation: ${data.vehicle.immatriculation}`, 20, 100);
        doc.text(`Couleur: ${data.vehicle.couleur}`, 20, 110);
        doc.text(`Puissance Fiscale: ${data.vehicle.puissance_fiscale}`, 20, 120);
        doc.text(`Date de mise en circulation: ${new Date(data.vehicle.date_premiere_mise_en_circulation).toLocaleDateString()}`, 20, 130);
        doc.text(`Catégorie: ${data.vehicle.category}`, 20, 140);

        QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H' }, (err: any, url: string) => {
          if (err) {
            console.error('Erreur lors de la génération du QR code:', err);
            return;
          }

          // Ajouter le QR Code au PDF
          doc.addImage(url, 'PNG', 150, 50, 40, 40); // Positionner l'image (QR code)
          // Générer le PDF sous forme de Blob
          const pdfBlob = doc.output('blob');

          // Créer un objet URL pour le Blob PDF
          const fileURL = URL.createObjectURL(pdfBlob);

          // Ouvrir le PDF dans un nouvel onglet
          window.open(fileURL, '_blank');
        });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    );
  }

  voirStatus(subscription: any) {
    this.baseService.getOne(`${environment.endPoint.subscriptions.status}`, subscription.id).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Status', detail: response.statut });
      }
    )
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
    return this.subscriptions ? this.first + this.rows >= this.subscriptions.length : true;
  }

  isFirstPage(): boolean {
    return this.subscriptions ? this.first === 0 : true;
  }

}
