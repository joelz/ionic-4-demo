import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, Subscription, fromEvent } from 'rxjs';
import { Platform, Config } from '@ionic/angular';

declare let $: any;
declare let kendo: any;

@Component({
    selector: 'app-chatbot4',
    templateUrl: 'chatbot4.page.html',
    styleUrls: ['chatbot4.page.scss']
})
export class Chatbot4Page implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('chatDiv', { static: false }) chatDiv: ElementRef;
    private keybaordWillShowSub: Subscription;
    private keyboardWillHideSub: Subscription;
    private keybaordDidShowSub: Subscription;

    constructor(private platform: Platform, private config: Config) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.setupChat();
        // 1.
        // 2.
        //this.addKeyboardListeners();
        this.chatDiv.nativeElement.querySelector('input.k-input').dataset['no_ionic_scroll_padding']='true';
    }

    ngOnDestroy() {
        // 1.
        //this.removeKeyboardListeners();
    }

    private addKeyboardListeners() {
        if (this.platform.is("cordova") && this.platform.is("ios")) {
            this.keybaordWillShowSub = fromEvent(window, 'keyboardWillShow').subscribe(e => {
                console.log(e);
                // 1.
                // const resizeHeight = 286 + (e as any).keyboardHeight;
                // $(this.chatDiv.nativeElement).css({ "height": resizeHeight + 'px' });
                // $(this.chatDiv.nativeElement).css({ "height": 'unset' });
                // $(this.chatDiv.nativeElement).css({ "max-height": 'unset' });

                // 2.
                // replace with scroll-padding-hack
                // this.chatDiv.nativeElement.closest('ion-content').style.setProperty("--keyboard-offset","0px")
            });
            this.keyboardWillHideSub = fromEvent(window, 'keyboardWillHide').subscribe(e => {
                console.log(e);
                // 1.
                //$(this.chatDiv.nativeElement).css({ "height": '100%' });
                //$(this.chatDiv.nativeElement).css({ "max-height": '100%' });
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
        if (this.keybaordWillShowSub) this.keybaordWillShowSub.unsubscribe();
        if (this.keyboardWillHideSub) this.keyboardWillHideSub.unsubscribe();
        if (this.keybaordDidShowSub) this.keybaordDidShowSub.unsubscribe();
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
