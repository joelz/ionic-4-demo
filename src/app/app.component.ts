import { Component, ViewChildren, QueryList } from '@angular/core';

import { Router  } from '@angular/router';
import {
    Platform, Config, NavController,
    LoadingController,
    ToastController,
    AlertController,
    MenuController,
    ModalController,
    PickerController,
    PopoverController,
    ActionSheetController,
    IonRouterOutlet
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { enableScrollPadding } from '../hacks/scroll-padding-hack';

declare let $: any;

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

    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private config: Config,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private pickerCtrl: PickerController,
        private popoverCtrl: PopoverController,
        private actionSheetCtrl: ActionSheetController,
        private navCtrl: NavController,
        private menuCtrl: MenuController,
        private router: Router
    ) {
        this.initializeApp();
        this.setupScrollPadding();

        this.platform.backButton.subscribeWithPriority(999990, async () => {

            // console.log('registerBackButtonAction fired!' + new Date());

            if ((window as any).photoSwiperInstance) {
                try {
                    // http://photoswipe.com/documentation/api.html
                    (window as any).photoSwiperInstance.close();
                    (window as any).StatusBar.show();
                } catch (e) {
                }
                return false;
            }

            if ((window as any).nanogallery2Instance) {
                try {
                    // https://nanogallery2.nanostudio.org/api.html
                    (window as any).nanogallery2Instance.nanogallery2('closeViewer');
                    (window as any).nanogallery2Instance = null;
                    (window as any).StatusBar.show();
                } catch (e) {
                }
                return false;
            }

            // Hide Menu
            const isMenuOpen = await this.menuCtrl.isOpen();
            if (isMenuOpen) {
                this.menuCtrl.close();
                return false;
            }

            // Hide overlays
            const activeOverlay =
                (await this.alertCtrl.getTop()) ||
                (await this.toastCtrl.getTop()) ||
                (await this.loadingCtrl.getTop()) ||
                (await this.pickerCtrl.getTop()) ||
                (await this.popoverCtrl.getTop()) ||
                (await this.actionSheetCtrl.getTop()) ||
                (await this.modalCtrl.getTop());
            if (activeOverlay) {
                // Files are downloading, do nothing
                if ($('div.download-progress-container progress:visible').length > 0) {
                    return false;
                }

                // There is a active modal with ion-nav and can go back
                const nav = document.querySelector('ion-nav');
                if (nav) {
                    const canGoBack = await nav.canGoBack();
                    if (canGoBack) {
                        nav.pop();
                        return false;
                    }
                }

                activeOverlay.dismiss();
                return false;
            }

            this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
                if (outlet && outlet.canGoBack()) {
                    outlet.pop();
                } else if (this.router.isActive('/home', true) && this.router.url === '/home') {
                    const alert = await this.alertCtrl.create({
                        header: 'Close App',
                        message: 'Are you sure to close app?',
                        buttons: [{
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => { }
                        }, {
                            text: 'Close App',
                            handler: () => {
                                navigator['app'].exitApp();
                            }
                        }]
                    });
                    alert.present();
                }
            });

            return false;
        });
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
