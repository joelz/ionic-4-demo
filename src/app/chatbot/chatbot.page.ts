import { Component, OnInit } from '@angular/core';

declare let BotUI: any;
@Component({
    selector: 'app-hatbot',
    templateUrl: 'chatbot.page.html',
    styleUrls: ['chatbot.page.scss']
})
export class ChatbotPage implements OnInit {
    private selectedItem: any;
    private icons = [
        'flask',
        'wifi',
        'beer',
        'football',
        'basketball',
        'paper-plane',
        'american-football',
        'boat',
        'bluetooth',
        'build'
    ];
    public items: Array<{ title: string; note: string; icon: string }> = [];

    constructor() {
    }

    ngOnInit() {
        setTimeout(this.rockPaperScissors, 1000 * 3);
        //setTimeout(this.thermostat, 1000 * 3);
        //setTimeout(this.githubStar, 1000 * 3);

    }


    thermostat() {
        var botui = new BotUI('my-botui-app'),
            temperature = 30;

        function init() {
            botui.message
                .bot({
                    delay: 700,
                    content: 'What would you like to do?'
                })
                .then(function () {
                    return botui.action.button({
                        delay: 1000,
                        action: [{
                            text: 'Check temperature',
                            value: 'check'
                        }, {
                            text: 'Change temperature',
                            value: 'change'
                        }]
                    })
                }).then(function (res) {
                    if (res.value == 'change') {
                        changeTemp();
                    } else {
                        botui.message.bot({
                            delay: 1200,
                            content: 'Current temperature is: ' + temperature + ' degree'
                        }).then(init);
                    }
                });
        }

        var changeTemp = function () {
            botui.message
                .bot({
                    delay: 500,
                    content: 'Change the temperature to ...'
                })
                .then(function () {
                    return botui.action.text({
                        delay: 1000,
                        action: {
                            size: 10,
                            icon: 'thermometer-empty',
                            value: temperature, // show the current temperature as default
                            sub_type: 'number',
                            placeholder: '26'
                        }
                    })
                }).then(function (res) {
                    temperature = res.value; // save new value
                    return botui.message
                        .bot({
                            delay: 1500,
                            loading: true, // pretend like we are doing something
                            content: 'temperature set to ' + res.value
                        });
                }).then(init); // loop to initial state
        }


        init();
    }

    githubStar() {
        var loadingMsgIndex,
            botui = new BotUI('my-botui-app'),
            API = 'https://api.github.com/repos/';

        function sendXHR(repo, cb) {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open('GET', API + repo);
            xhr.onload = function () {
                var res = JSON.parse(xhr.responseText)
                cb(res.stargazers_count);
            }
            xhr.send();
        }

        function init() {
            botui.message
                .bot({
                    delay: 1000,
                    content: 'Enter the repo name to see how many stars it have:'
                })
                .then(function () {
                    return botui.action.text({
                        delay: 1000,
                        action: {
                            value: 'moinism/botui',
                            placeholder: 'moinism/botui'
                        }
                    })
                }).then(function (res) {
                    loadingMsgIndex = botui.message.bot({
                        delay: 200,
                        loading: true
                    }).then(function (index) {
                        loadingMsgIndex = index;
                        sendXHR(res.value, showStars)
                    });
                });
        }

        function showStars(stars) {
            botui.message
                .update(loadingMsgIndex, {
                    content: 'it has !(star) ' + (stars || "0") + ' stars.'
                })
                .then(init); // ask again for repo. Keep in loop.
        }

        init();
    }

    rockPaperScissors() {

        var botui = new BotUI('my-botui-app');

        //global game variables
        var gameState = {
            'wins': 0,
            'losses': 0,
            'games': 0,
            'result': 0
        },
            resultMessages = ["It's a draw.", "You won!", "You lost..."],
            playMessages = [icon('hand-rock-o') + ' Rock', icon('hand-paper-o') + ' Paper', icon('hand-scissors-o') + ' Scissors'],
            maxGames = 5

        // work-around as markdown is not always correctly parsed
        function icon(iconName) {
            return '<i class="botui-icon botui-message-content-icon fa fa-' + iconName + '"></i>'
        }

        // entrypoint for the conversation
        function hello() {
            botui.message.bot({
                delay: 500,
                photo: '/assets/icon/favicon.png',
                content: "Would you like to play a game?"
            }).then(function () {
                return botui.action.button({
                    delay: 1000,
                    action: [{
                        icon: 'check',
                        text: 'Bring it on',
                        value: 'yes'
                    }, {
                        icon: 'times',
                        text: 'No thanks',
                        value: 'no'
                    }]
                })
            }).then(function (res) {
                if (res.value === 'yes') {
                    shifumi()
                } else {
                    botui.message.add({
                        delay: 500,
                        photo: '/assets/icon/favicon.png',
                        type: 'html',
                        content: icon('frown-o') + ' Another time perhaps'
                    })
                }
            })
        };

        // main game loop
        function shifumi() {
            botui.action.button({
                delay: 1000,
                addMessage: false,
                action: [{
                    icon: 'hand-rock-o',
                    text: 'Rock',
                    value: '0'
                }, {
                    icon: 'hand-paper-o',
                    text: 'Paper',
                    value: '1'
                }, {
                    icon: 'hand-scissors-o',
                    text: 'Scissors',
                    value: '2'
                }]
            }).then(function (res) {
                var playerMove = parseInt(res.value)
                var botMove = Math.floor(Math.random() * 3)
                //result = 0 -> draw, 1 -> win, 2 -> loss
                var result = (playerMove - botMove + 3) % 3
                gameState.result = result
                gameState.games += 1
                if (result === 1) {
                    gameState.wins += 1
                } else if (result === 2) {
                    gameState.losses += 1
                }
                botui.message.add({
                    delay: 1000,
                    loading: true,
                    human: true,
                    photo: '/assets/icon/favicon.png',
                    type: 'html',
                    content: playMessages[playerMove]
                });
                return botui.message.bot({
                    delay: 1000,
                    loading: true,
                    type: 'html',
                    content: playMessages[botMove]
                })
            }).then(function () {
                // fetch info from the global state
                var result = gameState.result
                var score = '<br/>Score: ' + icon('android') + ' ' + gameState.losses + ' - ' + gameState.wins + ' ' + icon('user')
                return botui.message.bot({
                    delay: 500,
                    type: 'html',
                    content: resultMessages[result] + score
                })
            }).then((gameState.games < maxGames) ? shifumi : goodbye)
        }

        function goodbye() {
            botui.message.bot({
                delay: 500,
                content: "You've played enough already. Get back to work!"
            })
        }

        hello();
        //shifumi()
    }

}
