declare let $: any;
declare let kendo: any;

export class SetSailChatbotAgent {

    public chat: any;
    public bot: any;
    public sender: any;
    private timestamp: any;
    private endpoint = '';

    constructor(chat, bot, sender, endpoint) {
        this.chat = chat;
        this.bot = bot;
        this.sender = sender;
        this.endpoint = endpoint;

        this.setupCustomTempaltes();
        // this.sendPostback('Welcome');
    }

    public sendPostback(payload) {
        this.ajaxPost(this.endpoint, {
            sender: {
                id: this.sender.id
            },
            recipient: {
                id: 'K11_APP'
            },
            timestamp: (new Date()).getTime(),
            postback: {
                payload
            }
        }).then($.proxy(this.onResponse, this));
    }

    public sendTextMessage(text) {
        this.ajaxPost(this.endpoint, {
            sender: {
                id: this.sender.id
            },
            recipient: {
                id: 'K11_APP'
            },
            timestamp: (new Date()).getTime(),
            message: {
                mid: kendo.guid(),
                text
            }
        }).then($.proxy(this.onResponse, this));
    }

    public sendQuickReply(payload) {
        this.ajaxPost(this.endpoint, {
            sender: {
                id: this.sender.id
            },
            recipient: {
                id: 'K11_APP'
            },
            timestamp: (new Date()).getTime(),
            message: {
                mid: kendo.guid(),
                text: payload,
                quick_reply: {
                    payload
                }
            }
        }).then($.proxy(this.onResponse, this));
    }

    public changeEndpoint(newEndpoint) {
        this.endpoint = newEndpoint;
    }

    private ajaxPost(url, data) {
        return $.ajax({
            url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify(data)
        });
    }

    private onResponse(response) {
        console.log(response);
        // this.timestamp = (new Date()).getTime(); // TODO: no timestamp from server??

        if (response.message) {
            const message = response.message;
            if (message.series) {
                message.series.forEach(m => {
                    if (typeof m === 'string') {
                        this.renderSingleMessage({ text: m });
                    } else {
                        this.renderSingleMessage(m);
                    }
                });
            } else {
                this.renderSingleMessage(message);
            }
        }
    }

    private renderSingleMessage(message) {
        if (message.text) {
            this.renderText(message.text);
        }
        if (message.attachment) {
            this.renderAttachments(message.attachment);
        }
        if (message.quick_replies) {
            this.renderSuggestedActions(message.quick_replies);
        }
    }

    private renderText(text) {
        this.chat.renderMessage({ type: 'text', text, timestamp: new Date() }, this.bot);
    }

    private renderAttachments(attachment) {
        const data: any = {};
        if (attachment.type === 'image') {
            // TODO: image attachment
            /*
                    {
                        "type": "image",
                        "payload": {
                            "url": "https://petersapparel.com/img/shirt.png"
                        }
                    }
            */
            data.attachments = [{
                contentType: 'image',
                content: {
                    url: attachment.payload.url
                }
            }];
            this.chat.renderAttachments(data, this.bot);
        } else if (attachment.type === 'video') {
            /*
            {
                "type": "video",
                "payload": {
                    "url": "https://petersapparel.com/bin/clip.mp3"
                }
            }*/
            data.attachments = [{
                contentType: 'video',
                content: {
                    url: attachment.payload.url
                }
            }];

            this.chat.renderAttachments(data, this.bot);
        } else if (attachment.type === 'template' && attachment.payload && attachment.payload.template_type === 'generic') {
            // TODO: default_action?
            // TODO: postback?
            /*  {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Welcome to Peter\'s Hats",
                                "image_url": "https://.../company_image.png",
                                "subtitle": "We\'ve got the right hat for everyone.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://.../",
                                    "webview_height_ratio": "tall"
                                },
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "View Website",
                                        "payload": "backend defined payload"
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Start Chatting",
                                        "payload": "backend defined payload"
                                    }
                                ]
                            }
                        ]
                    }
                }
            */
            data.attachmentLayout = 'carousel';
            data.attachments = attachment.payload.elements.map(n => {
                const atta: any = {
                    contentType: 'heroCard',
                    content: {
                        title: n.title,
                        subtitle: n.subtitle,
                        images: [{ url: n.image_url }],
                        buttons: n.buttons.map(b => {
                            return {
                                type: 'postBack',
                                title: b.title,
                                value: b.payload
                            };
                        })
                    }
                };
                return atta;
            });

            this.chat.renderAttachments(data, this.bot);
        }
    }

    private renderSuggestedActions(quickReplies) {
        /*
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Small",
                "payload": "backend defined payload"
            },
            {
                "content_type": "text",
                "title": "Medium",
                "payload": "backend defined payload"
            },
            {
                "content_type": "text",
                "title": "Large",
                "payload": "backend defined payload"
            }
        ]
        */
        // TODO quick reply contains content_type='location'?
        this.chat.renderSuggestedActions(quickReplies.map(n => { return { title: n.title, value: n.payload } }));
    }

    private setupCustomTempaltes() {
        const VIDEO_CARD_TEMPLATE = kendo.template(
            '<div class="k-card k-card-type-rich">' +
            '<div class="k-card-body quoteCard" style="padding: 8px;">' +

            '<div>​​​​​​​​​​​​​​<video controls="" src="#:url#" ' +
            'class="chat-video-clip" width="100%" style="max-width: 640px;"></video></div>' +

            '</div>' +
            '</div>'
        );
        kendo.chat.registerTemplate('video', VIDEO_CARD_TEMPLATE);

        const IMAGE_CARD_TEMPLATE = kendo.template(
            '<div class="k-card k-card-type-rich"  style="width:60%">' +
            '<div class="k-card-body quoteCard" style="padding: 8px;">' +

            '<div>​​​​​​​​​​​​​​<image src="#:url#" class="chat-image" ' +
            'width="100%" style="max-width: 640px;"/></div>' +

            '</div>' +
            '</div>'
        );
        kendo.chat.registerTemplate('image', IMAGE_CARD_TEMPLATE);
    }
}
