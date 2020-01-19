import { Component } from '@angular/core';

import { Platform, Config } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { enableScrollPadding } from '../hacks/scroll-padding-hack';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'List',
            url: '/list',
            icon: 'list'
        },
        // {
        //     title: 'BotUI',
        //     url: '/chatbot',
        //     icon: 'bowtie'
        // },
        // {
        //     title: 'Kendo UI for Angular',
        //     url: '/chatbot2',
        //     icon: 'bowtie'
        // },
        // {
        //     title: 'Kendo UI for jQuery',
        //     url: '/chatbot3',
        //     icon: 'bowtie'
        // },
        // {
        //     title: 'Kendo UI for jQuery(echo)',
        //     url: '/chatbot4',
        //     icon: 'bowtie'
        // },
        {
            title: 'Chatbot',
            url: '/chatbot5',
            icon: 'bowtie'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private config: Config,
    ) {
        this.initializeApp();
        this.setupScrollPadding();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    setupScrollPadding() {
        // code from https://github.com/ionic-team/ionic/blob/master/core/src/components/app/app.tsx
        // ...
        // const needInputShims = () => {
        //     return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
        // };
        // ...
        // if (config.getBoolean('inputShims', needInputShims())) {
        //     import('../../utils/input-shims/input-shims').then(module => module.startInputShims(config));
        // }

        // code from https://github.com/ionic-team/ionic/blob/master/core/src/utils/input-shims/input-shims.ts
        // ...
        // const keyboardHeight = config.getNumber('keyboardHeight', 290);
        // ...
        // if (scrollPadding && SCROLL_PADDING) {
        //     enableScrollPadding(keyboardHeight);
        // }

        if (this.config.getBoolean('inputShims', this.platform.is('ios') && this.platform.is('mobile'))) {
            const keyboardHeight = this.config.getNumber('keyboardHeight', 290);
            enableScrollPadding(keyboardHeight);
        }
    }

}
