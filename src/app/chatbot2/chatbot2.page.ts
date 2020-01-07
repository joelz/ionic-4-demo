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
    }, {
        author: this.bot,
        text: 'a message with attachmetns',
        attachmentLayout: 'carousel',
        attachments: [{
            contentType: "heroCard",
            content: {
                "title": "Full Coverage",
                "subtitle": "5% of car cost",
                "images": [
                    {
                        "url": "https://demos.telerik.com/kendo-ui/content/chat/quote_full.jpeg"
                    }
                ],
                "buttons": [
                    {
                        "type": "postBack",
                        "title": "View Details",
                        "value": "View details of Full Coverage"
                    },
                    {
                        "type": "postBack",
                        "title": "Get a Quote",
                        "value": "Get a quote for Full Coverage"
                    }
                ]
            }

        }, {
            contentType: "heroCard",
            content: {
                "title": "Collision, fire and theft",
                "subtitle": "4% of car cost",
                "images": [
                    {
                        "url": "https://demos.telerik.com/kendo-ui/content/chat/quote_collision.jpeg"
                    }
                ],
                "buttons": [
                    {
                        "type": "postBack",
                        "title": "View Details",
                        "value": "View details of Collision, fire and theft"
                    },
                    {
                        "type": "postBack",
                        "title": "Get a Quote",
                        "value": "Get a quote for Collision, fire and theft"
                    }
                ]
            }
        }, {
            contentType: "heroCard",
            content: {
                "title": "Collision only",
                "subtitle": "2% of car cost",
                "images": [
                    {
                        "url": "https://demos.telerik.com/kendo-ui/content/chat/quote_collision_only.jpeg"
                    }
                ],
                "buttons": [
                    {
                        "type": "postBack",
                        "title": "View Details",
                        "value": "View details of Collision only"
                    },
                    {
                        "type": "postBack",
                        "title": "Get a Quote",
                        "value": "Get a quote for Collision only"
                    }
                ]
            }
        }, {
            contentType: "heroCard",
            content: {
                "title": "Young driver",
                "subtitle": "6% of car cost",
                "images": [
                    {
                        "url": "https://demos.telerik.com/kendo-ui/content/chat/quote_young.jpeg"
                    }
                ],
                "buttons": [
                    {
                        "type": "postBack",
                        "title": "View Details",
                        "value": "View details of Young driver"
                    },
                    {
                        "type": "postBack",
                        "title": "Get a Quote",
                        "value": "Get a quote for Young driver"
                    }
                ]
            }
        }
        ]
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
