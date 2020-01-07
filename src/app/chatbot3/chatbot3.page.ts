// kendo UI Chat / Insurance sample : https://demos.telerik.com/kendo-ui/chat/index
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

declare let $: any;
declare let kendo: any;
declare let DialogFlowAgent: any;

@Component({
    selector: 'app-chatbot3',
    templateUrl: 'chatbot3.page.html',
    styleUrls: ['chatbot3.page.scss']
})
export class Chatbot3Page implements OnInit, AfterViewInit {
    @ViewChild('chatDiv', { static: false }) chatDiv: ElementRef;
    constructor() {
    }

    ngOnInit() {

        let QUOTE_CARD_TEMPLATE = kendo.template(
            '<div class="k-card k-card-type-rich">' +
            '<p><strong>Your car insurance would be:</strong></p>' +
            '<div class="k-card-body quoteCard">' +
            '<div><strong>Type:</strong>' +
            '<span>#:coverage#</span></div>' +

            '<div><strong>Car model:</strong>' +
            '<span>#:make# #:model#</span></div>' +

            '<div><strong>Car cost:</strong>' +
            '<span>#:worth#</span></div>' +

            '<div><strong>Start date:</strong>' +
            '<span>#:startDate#</span></div>' +

            '<hr/><div><strong>Total:</strong>' +
            '<span>#=kendo.toString(premium, "0.00")#</span></div>' +
            '</div>' +
            '</div>'
        );
        kendo.chat.registerTemplate("quote", QUOTE_CARD_TEMPLATE);

        let PLAN_CARD_TEMPLATE = kendo.template(
            '<div class="k-card k-card-type-rich">' +
            '<div class="k-card-body quoteCard">' +

            '# for (var i = 0; i < rows.length; i++) { #' +
            '<div><strong>#:rows[i].text#: </strong>' +
            '<span>#= kendo.toString(rows[i].value, "0.00") #</span></div>' +
            '# } #' +

            '<hr/><div><strong>Total:</strong>' +
            '<span>#= kendo.toString(premium, "0.00") #</span></div>' +

            '</div>' +
            '</div>'
        );
        kendo.chat.registerTemplate("payment_plan", PLAN_CARD_TEMPLATE);
    }

    ngAfterViewInit() {
        let chat = $(this.chatDiv.nativeElement).kendoChat({
            user: {
                name: kendo.guid(),
                iconUrl: "./assets/icon/favicon.png",
            },
            post: function (args) {
                agent.postMessage(args.text);
            },
            toolClick: function (ev) {
                if (ev.name === "restart") {
                    ev.sender.postMessage("restart");
                }
            },
            toolbar: {
                toggleable: true,
                buttons: [
                    { name: "restart", iconClass: "k-icon k-i-reload" }
                ]
            }
        }).data("kendoChat");

        let agent = new DialogFlowAgent(chat);


        setTimeout(() => {
            const userInfo = {
                id: "botty",
                iconUrl: "./assets/InsuranceBot.png",
                name: "Botty McbotFace"
            };
            const data = {
                text: 'a message with attachmetns',
                attachmentLayout: 'carousel',
                attachments: [{
                    contentType: 'heroCard',
                    content: {
                        title: 'Full Coverage',
                        subtitle: '5% of car cost',
                        images: [
                            {
                                url: 'https://demos.telerik.com/kendo-ui/content/chat/quote_full.jpeg'
                            }
                        ],
                        buttons: [
                            {
                                type: 'postBack',
                                title: 'View Details',
                                value: 'View details of Full Coverage'
                            },
                            {
                                type: 'postBack',
                                title: 'Get a Quote',
                                value: 'Get a quote for Full Coverage'
                            }
                        ]
                    }
                }, {
                    contentType: 'heroCard',
                    content: {
                        title: 'Collision, fire and theft',
                        subtitle: '4% of car cost',
                        images: [
                            {
                                url: 'https://demos.telerik.com/kendo-ui/content/chat/quote_collision.jpeg'
                            }
                        ],
                        buttons: [
                            {
                                type: 'postBack',
                                title: 'View Details',
                                value: 'View details of Collision, fire and theft'
                            },
                            {
                                type: 'postBack',
                                title: 'Get a Quote',
                                value: 'Get a quote for Collision, fire and theft'
                            }
                        ]
                    }
                }, {
                    contentType: 'heroCard',
                    content: {
                        title: 'Collision only',
                        subtitle: '2% of car cost',
                        images: [
                            {
                                url: 'https://demos.telerik.com/kendo-ui/content/chat/quote_collision_only.jpeg'
                            }
                        ],
                        buttons: [
                            {
                                type: 'postBack',
                                title: 'View Details',
                                value: 'View details of Collision only'
                            },
                            {
                                type: 'postBack',
                                title: 'Get a Quote',
                                value: 'Get a quote for Collision only'
                            }
                        ]
                    }
                }, {
                    contentType: 'heroCard',
                    content: {
                        title: 'Young driver',
                        subtitle: '6% of car cost',
                        images: [
                            {
                                url: 'https://demos.telerik.com/kendo-ui/content/chat/quote_young.jpeg'
                            }
                        ],
                        buttons: [
                            {
                                type: 'postBack',
                                title: 'View Details',
                                value: 'View details of Young driver'
                            },
                            {
                                type: 'postBack',
                                title: 'Get a Quote',
                                value: 'Get a quote for Young driver'
                            }
                        ]
                    }
                }
                ]
            };

            // render some messages with hero card
            chat.renderAttachments(data, userInfo);

            setTimeout(() => {
                // render some messages with actions
                chat.renderMessage({ type: 'text', text: 'now some actions:', timestamp: new Date() }, userInfo);
                chat.renderSuggestedActions([
                    { title: 'View all products', value: 'View all products' },
                    { title: 'Get a quote for Full coverage', value: 'Get a quote for Full coverage' },
                    { title: 'reply', value: 'reply' }
                ]);
            }, 1000 * 2);

        }, 1000 * 3);
    }

}
