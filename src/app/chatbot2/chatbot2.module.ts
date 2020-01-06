import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ChatModule } from '@progress/kendo-angular-conversational-ui';

import { Chatbot2Page } from './chatbot2.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChatModule,
        RouterModule.forChild([
            {
                path: '',
                component: Chatbot2Page
            }
        ])
    ],
    declarations: [Chatbot2Page]
})
export class Chatbot2PageModule { }
