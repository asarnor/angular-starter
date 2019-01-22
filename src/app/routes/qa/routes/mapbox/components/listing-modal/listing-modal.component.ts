import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-listing-modal',
  templateUrl: './listing-modal.component.html',
  styleUrls: ['./listing-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public dataAlt: any,
  ) {}

  ngOnInit() {}

  /**
   * Submit the form
   */
  public submit() {
    this.dialogRef.close(this.dataAlt || this.data);
  }
}
