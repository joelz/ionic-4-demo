import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

declare let $: any;
declare let kendo: any;

@Component({
    selector: 'app-chatbot4',
    templateUrl: 'chatbot4.page.html',
    styleUrls: ['chatbot4.page.scss']
})
export class Chatbot4Page implements OnInit, AfterViewInit {
    @ViewChild('chatDiv', { static: false }) chatDiv: ElementRef;
    constructor() {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.setupChat();
    }

    setupChat() {
        const bot = {
            id: 'botty',
            iconUrl: './assets/InsuranceBot.png',
            name: 'Botty McbotFace'
        };

        const chat = $(this.chatDiv.nativeElement).kendoChat({
            user: {
                name: kendo.guid(),
                iconUrl: './assets/icon/favicon.png',
            },
            post: (args) => {
                setTimeout(() => {
                    chat.renderMessage({ type: 'text', text: 'You just said: ' + args.text, timestamp: new Date() }, bot);
                }, 1000);
            },
            toolClick: (ev) => {
                if (ev.name === 'restart') {
                    ev.sender.postMessage('restart');
                }
            },
            toolbar: {
                toggleable: true,
                buttons: [
                    { name: 'restart', iconClass: 'k-icon k-i-reload' }
                ]
            }
        }).data('kendoChat');

        setTimeout(() => {
            // render some messages with actions
            chat.renderMessage({ type: 'text', text: 'Welocom message with some actions:', timestamp: new Date() }, bot);
            chat.renderSuggestedActions([
                { title: 'View all products', value: 'View all products' },
                { title: 'Get a quote for Full coverage', value: 'Get a quote for Full coverage' },
                { title: 'reply', value: 'reply' }
            ]);

        }, 1000 * 0.5);
    }

}
