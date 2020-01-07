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
    }

}
