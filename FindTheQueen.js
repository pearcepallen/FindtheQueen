class FindTheQueen {
    constructor(c1, c2)
    {
        this.clients = [c1, c2];
        this.role = ['Dealer', 'Spotter'];
        this.choices = [null, null];
        this.Dealer = '';
        this.Spotter = '';
        this.round = 1;
        this.dealerScore = 0;
        this.spotterScore = 0;
        this.Random = Math.floor(Math.random() * 2);
        this.randOther = 0;

        if(this.Random == 0)
        {
            this.Dealer = 0
            this.Spotter = 1
        }
        else 
        {
            this.Dealer = 1
            this.Spotter = 0
        }

        if(this.Random == 0)
        {
            this.randOther = 1;
            this.sendToClient(0, 'You are the '+this.role[this.Random]);
            this.sendToClient(1, 'You are the '+this.role[this.randOther]);
            
        }
        else 
        {
            this.randOther = 0;
            this.sendToClient(0, 'You are the '+this.role[this.Random]);
            this.sendToClient(1, 'You are the '+this.role[this.randOther]);
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
            this.sendToClients('Round complete: ' + choices.join(' - '));
            this.getRoundScore();
            this.choices = [null, null];
            this.round++;

            if(this.round > 5){
                this.sendToClients('Game Over');

                if(this.dealerScore > this.spotterScore) {
                    this.sendToClient(this.Dealer, 'Victory');
                    this.sendToClient(this.Spotter, 'Defeat');
                }
                else {
                    this.sendToClient(this.Spotter, 'Victory');
                    this.sendToClient(this.Dealer, 'Defeat');
                }

                this.clients.forEach((client) => {
                    client.disconnect(); 
                });
            }
            this.sendToClients(' ');
            this.sendToClients('Round '+this.round);
            // this.switch() //not implemented 
        }
    }


    getRoundScore() {
        const opt1 = this.choices[0];
        const opt2 = this.choices[1];
        console.log(this.Spotter)
        console.log(this.Dealer)
        if (opt1 == opt2) {
            this.spotterScore++;
            this.sendToClient(this.Spotter, 'You won this round');
            this.sendToClient(this.Dealer, 'You lost this round');
        }
        else {
            this.dealerScore++;
            this.sendToClient(this.Dealer, 'You won this round');
            this.sendToClient(this.Spotter, 'You lost this round');
        }
    }

}

module.exports = FindTheQueen;