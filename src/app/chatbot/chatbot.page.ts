import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-hatbot',
    templateUrl: 'chatbot.page.html',
    styleUrls: ['chatbot.page.scss']
})
export class ChatbotPage implements OnInit {
    private selectedItem: any;
    private icons = [
        'flask',
        'wifi',
        'beer',
        'football',
        'basketball',
        'paper-plane',
        'american-football',
        'boat',
        'bluetooth',
        'build'
    ];
    public items: Array<{ title: string; note: string; icon: string }> = [];

    constructor() {
    }

    ngOnInit() {

    }

}
