const db = require("./service/service.js");

class FindTheQueen {
    constructor(c1, c2)
    {
        this.users = ['dannyboi', 'matty7']
        this.clients = [c1, c2];
        this.role = ['Dealer', 'Spotter'];
        this.choices = [null, null];
        this.scores = [0, 0];
        this.Dealer = '';
        this.Spotter = '';
        this.round = 1;
        this.Random = Math.floor(Math.random() * 2);

        if(this.Random == 0)
        {
            this.Dealer = 0
            this.Spotter = 1
            this.sendToClient(0, 'You are the '+this.role[this.Random]);
            this.sendToClient(1, 'You are the '+this.role[1]);
        }
        else 
        {
            this.Dealer = 1
            this.Spotter = 0
            this.sendToClient(0, 'You are the '+this.role[this.Random]);
            this.sendToClient(1, 'You are the '+this.role[0]);
        }
        
        this.clients.forEach((client, index) => {
            client.on('choice', (choice) => {
                this.onChoice(index, choice);
            });
        });
    }    


    sendToClient(clientIndex, msg) {
        this.clients[clientIndex].emit('message', msg)
    }


    sendToClients(msg) {
        this.clients.forEach((client) => {
            client.emit('message', msg);
        })
    }


    onChoice(clientIndex, choice) {
        this.choices[clientIndex] = choice;
        this.sendToClient(clientIndex, `You selected ${choice}`);

        this.checkGame(clientIndex);
       
    }


    checkGame(clientIndex, client) {
        const choices = this.choices;
        if(choices[0] && choices[1]) {
            this.sendToClients('Round Complete');
            this.sendToClients('Dealer: ' + choices[this.Dealer] + ' | ' + 'Spotter: ' + choices[this.Spotter]);
            this.getRoundScore();
            this.choices = [null, null];
            this.round++;
            if(this.round > 5){
                this.sendToClients('Game Over');

                if(this.scores[this.Dealer] > this.scores[this.Spotter]) {
                    this.sendToClient(this.Dealer, 'Victory');
                    this.sendToClient(this.Spotter, 'Defeat');
                }
                else {
                    this.sendToClient(this.Spotter, 'Victory');
                    this.sendToClient(this.Dealer, 'Defeat');
                }
                this.sendToClients('Thanks For Playing')
                this.clients.forEach((client, index) => {
                    db.update(this.users[index]);
                    client.emit('disconnectClient');
                    client.disconnect(); 
                });
            }
            this.sendToClients(' ');
            this.sendToClients('Round '+this.round);
            this.switch()
        }
    }


    getRoundScore() {
        const opt1 = this.choices[0];
        const opt2 = this.choices[1];
        if (opt1 == opt2) {
            this.scores[this.Spotter]++;
            this.sendToClient(this.Spotter, 'You won this round');
            this.sendToClient(this.Dealer, 'You lost this round');
        }
        else {
            this.scores[this.Dealer]++;
            this.sendToClient(this.Dealer, 'You won this round');
            this.sendToClient(this.Spotter, 'You lost this round');
        }
    }


    switch() {
        let a = this.Dealer;
        let b = this.Spotter;

        this.Spotter = a;
        this.Dealer = b;

        this.sendToClient(this.Dealer, 'You are now the Dealer ');
        this.sendToClient(this.Spotter, 'You are now the Spotter ');
    }

}

module.exports = FindTheQueen;