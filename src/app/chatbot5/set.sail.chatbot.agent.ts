import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

declare let $: any;
declare let kendo: any;

export class SetSailChatbotAgent {

    public chat: any;
    public bot: any;
    public sender: any;
    private timestamp: any;
    private endpoint = '';

    constructor(chat, bot, sender, endpoint, enablePhotoSwipe?) {
        this.chat = chat;
        this.bot = bot;
        this.sender = sender;
        this.endpoint = endpoint;

        this.setupCustomTempaltes();

        if (enablePhotoSwipe) {
            this.initPhotoSwipeFromDOM(chat.element[0]);
        }
        // this.chat.click((e) => { console.log(e); });
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
        // console.log(response);
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

        // TODO: where to get the image size?
        const IMAGE_CARD_TEMPLATE = kendo.template(
            '<div class="k-card k-card-type-rich"  style="width:60%">' +
            '<div class="k-card-body quoteCard" style="padding: 8px;">' +

            '<div class="photo-swipe-slide">​​​​​​​​​​​​​​<image src="#:url#" class="chat-image" ' +
            'width="100%" style="max-width: 640px;"/></div>' +

            '</div>' +
            '</div>'
        );
        kendo.chat.registerTemplate('image', IMAGE_CARD_TEMPLATE);
    }

    // chatElement: dom object
    private initPhotoSwipeFromDOM(chatElement) {

        // <div class="k-message-list k-avatars" ...>
        //     <div class="photo-swipe-slide">
        //         ​​​​​​​​​​​​​​<image src="#:url#" class="chat-image" width="100%" style="max-width: 640px;"/></div>
        //     </div>
        //     ...
        // </div>

        // parse slide data (url, title, size ...) from DOM elements
        // el = <div class="k-message-list k-avatars" data-role="chat" aria-live="polite">...</div>
        const parseThumbnailElements = (el) => {
            const slideElements = el.querySelectorAll('.photo-swipe-slide'),
                numNodes = slideElements.length,
                items = [];
            let slideEl, img, src, size, item;

            for (let i = 0; i < numNodes; i++) {
                slideEl = slideElements[i]; // <div class="... photo-swipe-slide">

                // include only element nodes
                if (slideEl.nodeType !== 1) {
                    continue;
                }
                img = slideEl.querySelector('img');
                src = img.getAttribute('src');
                // size = img.getAttribute('data-size').split('x');
                size = src.split('@')[1].split('x');

                item = {
                    src,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                items.push(item);
            }

            // console.log(items);

            return items;
        };

        // find nearest parent element
        const closest = (el, fn) => {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        };

        // triggers when user clicks on thumbnail image
        const onThumbnailsClick = (e) => {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            const eTarget = e.target || e.srcElement;

            // find root element of clicked slide: <div class="... photo-swipe-slide">
            const clickedListItem = closest(eTarget, (el) => {
                return el.tagName && el.className.indexOf('photo-swipe-slide') > -1;
            });

            if (!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            const clickedGallery = closest(eTarget, (el) => {
                return el.tagName && el.className.indexOf('k-message-list') > -1;
            });
            const childNodes = clickedGallery.querySelectorAll('.photo-swipe-slide');
            const numChildNodes = childNodes.length;
            let nodeIndex = 0;
            let index = -1;

            for (let i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue;
                }

                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if (index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe(index, clickedGallery, true);
            }
            return false;
        };

        // clickedGallery = <div class="k-message-list k-avatars" data-role="chat" aria-live="polite">...</div>
        const openPhotoSwipe = (index, clickedGallery, disableAnimation) => {
            const pswpElement = document.querySelectorAll('.pswp')[0];
            let gallery, options, items;

            items = parseThumbnailElements(clickedGallery);

            // define options (if needed)

            options = {
                /* "showHideOpacity" uncomment this If dimensions of your small thumbnail don't match dimensions of large image */
                // showHideOpacity:true,

                closeEl: true,
                captionEl: true,
                fullscreenEl: false,
                zoomEl: false,
                shareEl: false,
                counterEl: false,
                arrowEl: true,
                preloaderEl: true,
                history: false,
                galleryUID: clickedGallery.getAttribute('data-pswp-uid'),
            };

            options.index = parseInt(index, 10);

            // exit if index not found
            if (isNaN(options.index)) {
                return;
            }

            if (disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();

            // for registerBackButtonAction in app.component.ts
            (window as any).photoSwiperInstance = gallery;
            (window as any).cordova && (window as any).StatusBar.hide();
            gallery.listen('destroy', () => {
                (window as any).photoSwiperInstance = null;
                (window as any).cordova && (window as any).StatusBar.show();
            });

        };

        chatElement.querySelector('.k-message-list').setAttribute('data-pswp-uid', kendo.guid());
        chatElement.onclick = (e) => {
            // console.log(e);
            const eTarget = e.target || e.srcElement;
            if (eTarget.parentNode && eTarget.parentNode.tagName) {
                const className = eTarget.parentNode.className;
                if (className && className.indexOf && className.indexOf('photo-swipe-slide') > -1) {
                    onThumbnailsClick(e);
                }
            }
        };

    }
}
