import { Component } from '@angular/core';
import { Kommunicate } from '@ionic-native/kommunicate/ngx';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(
        private kommunicate: Kommunicate,
        private loadingCtrl: LoadingController,
        private alertController: AlertController,
        private toastController: ToastController
    ) {

    }
    async startChat() {
        const alert = await this.alertController.create({
            header: 'Enter your display name',
            inputs: [
                {
                    name: 'displayName',
                    type: 'text',
                    placeholder: 'display name'
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
                        if (!data.displayName) {
                            window.alert('please input display name!');
                            return false;
                        }

                        const loading = await this.loadingCtrl.create({
                            spinner: 'crescent',
                            message: 'Loading'
                        });
                        await loading.present();

                        const user = {
                            userId: this.getRandomId(),
                            displayName: data.displayName
                        };
                        const conversationObject = {
                            appId: '47decf797ce400dc14908f5906783bcc',
                            kmUser: JSON.stringify(user)
                        };

                        this.kommunicate.conversationBuilder(conversationObject)
                            .then((clientChannelKey: any) => {
                                console.log('Kommunicate create conversation successful the clientChannelKey is : ' + clientChannelKey);
                            })
                            .catch((error: any) => {
                                console.error('Error creating conversation.' + error);
                            })
                            .finally(() => { loading.dismiss(); });

                        return false;
                    }
                }
            ]
        });

        await alert.present();
    }

    public getRandomId(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }


    rangeValue:any = 6;
    textValue:any = "6";

    valueChanged($event, type) {
        if (type === 10) {
            console.log(new Date());
            this.rangeValue = parseFloat(this.textValue);
        } else if (type === 20) {
            console.log('range value changed:', $event);
            this.textValue = this.rangeValue.toFixed(3);
        }
    }
}
