import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RECIPIENTS_ROUTES } from './recipients.routes';

@NgModule({
  imports: [
    RouterModule.forChild(RECIPIENTS_ROUTES)
  ],
  exports: [RouterModule]
})
export class RecipientsModule { } 