import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, Subscription, fromEvent } from 'rxjs';
import { Platform, Config, AlertController } from '@ionic/angular';
import { SetSailChatbotAgent } from './set.sail.chatbot.agent';

declare let $: any;
declare let kendo: any;

@Component({
    selector: 'app-chatbot5',
    templateUrl: 'chatbot5.page.html',
    styleUrls: ['chatbot5.page.scss']
})
export class Chatbot5Page implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('chatDiv', { static: false }) chatDiv: ElementRef;
    private keybaordWillShowSub: Subscription;
    private keyboardWillHideSub: Subscription;
    private keybaordDidShowSub: Subscription;

    chat: any;
    setSailAgent: any;
    endpoint = 'http://localhost:3030/api/chatbot/v1';

    constructor(
        private platform: Platform,
        private config: Config,
        public alertController: AlertController
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.setupChat();
        this.chatDiv.nativeElement.querySelector('input.k-input').dataset['no_ionic_scroll_padding']='true';
    }

    ngOnDestroy() {
    }

    private addKeyboardListeners() {
        if (this.platform.is('cordova') && this.platform.is('ios')) {
            this.keybaordWillShowSub = fromEvent(window, 'keyboardWillShow').subscribe(e => {
                console.log(e);
            });
            this.keyboardWillHideSub = fromEvent(window, 'keyboardWillHide').subscribe(e => {
                console.log(e);
            });

            // make input scroll into view
            // this.keybaordDidShowSub = fromEvent(window, 'keyboardDidShow').subscribe(e => {
            //     console.log(e);
            //     setTimeout(()=>{
            //         const activeEle=document.activeElement;
            //         console.log(activeEle);
            //         if(activeEle.className=='k-input'){
            //             activeEle.scrollIntoView();
            //         }
            //     },200);
            // });
        }
    }

    private removeKeyboardListeners() {
        if (this.keybaordWillShowSub) { this.keybaordWillShowSub.unsubscribe(); }
        if (this.keyboardWillHideSub) { this.keyboardWillHideSub.unsubscribe(); }
        if (this.keybaordDidShowSub) { this.keybaordDidShowSub.unsubscribe(); }
    }

    setupChat() {
        const bot = {
            id: 'botty',
            iconUrl: './assets/InsuranceBot.png',
            name: 'Botty'
        };
        const senderId = kendo.guid();
        const sender = {
            id: senderId,
            iconUrl: './assets/icon/favicon.png',
            name: 'John Doe',
        };

        const chat = $(this.chatDiv.nativeElement).kendoChat({
            user: sender,
            // Fires when a message is posted through the Chat message box.
            sendMessage: (args) => {
                console.log('sendMessage event:');
                console.log(args);
                setSailAgent.sendTextMessage(args.text);
            },
            // Fired when an action button is clicked inside an attachment template or when a suggestedAction is clicked.
            actionClick: (e) => {
                console.log('actionClick event:');
                console.log(e);
                setSailAgent.sendQuickReply(e.text);
            },
            // Fires when a message is posted to the Chat. Can be either through the message box, or through an action button click.
            post: (args) => {
                console.log('post event:');
                console.log(args);
            },
            toolClick: (ev) => {
                if (ev.name === 'restart') {
                    ev.sender.postMessage('restart');
                    setSailAgent.sendTextMessage('restart');
                }
            },
            toolbar: {
                toggleable: true,
                buttons: [
                    { name: 'restart', iconClass: 'k-icon k-i-reload' }
                ]
            }
        }).data('kendoChat');

        const setSailAgent = new SetSailChatbotAgent(chat, bot, sender, this.endpoint);

        this.chat = chat;
        this.setSailAgent = setSailAgent;

        setTimeout(() => {
            chat.renderMessage({ type: 'text', text: 'Welocom! Try to type some words.', timestamp: new Date() }, bot);
        }, 1000 * 1);
    }

    async setupEndpoint() {
        const alert = await this.alertController.create({
            header: 'Change Endpoint',
            subHeader: 'current endpoint: ' + this.endpoint,
            inputs: [
                {
                    name: 'endpoint',
                    type: 'text',
                    placeholder: 'new endpoint'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: async (data) => {
                        if (!data.endpoint) {
                            window.alert('please input endpoint!');
                            return false;
                        }
                        this.endpoint = data.endpoint;
                        this.setSailAgent.changeEndpoint(this.endpoint);
                        return false;
                    }
                }
            ]
        });

        await alert.present();
    }
}
