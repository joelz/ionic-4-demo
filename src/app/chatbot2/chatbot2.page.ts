import { Component, OnInit } from '@angular/core';
import { Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';

declare let BotUI: any;
@Component({
    selector: 'app-hatbot',
    templateUrl: 'chatbot2.page.html',
    styleUrls: ['chatbot2.page.scss']
})
export class Chatbot2Page implements OnInit {

    public readonly user: User = {
        id: 1,
        name: 'Jane',               // Optional
        avatarUrl: '/assets/icon/favicon.png',   // Optional
    };

    public readonly bot: User = {
        id: 0,
        name: 'SuperBot',               // Optional
        avatarUrl: '/assets/icon/favicon.png',   // Optional
    };

    public messages: Message[] = [{
        author: this.bot,
        text: 'A sample message',
        suggestedActions: [{
            value: 'A sample reply',
            type: 'reply'
        }, {
            title: 'A sample link',
            value: '#link',
            type: 'openUrl'
        }, {
            title: 'Place a call',
            value: '555-123-456',
            type: 'call'
        }, {
            title: 'A custom action',
            value: 'Custom action clicked',
            type: 'alert'
        }]
    }];

    constructor() {
    }

    ngOnInit() {
    }

    public onAction(e: ExecuteActionEvent): void {
        if (e.action.type === 'alert') {
            alert(e.action.value);
        }
    }

    public sendMessage(e: SendMessageEvent): void {
        console.log(new Date());
        this.messages = [...this.messages, e.message];

        setTimeout(() => {
            this.messages = [...this.messages, {
                author: this.bot,
                text: 'You say: ' + e.message.text
            }];
        }, 1000 * 1);
    }

}
