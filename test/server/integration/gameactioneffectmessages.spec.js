describe('game action effect messages', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['fine-katana'] }]
                },
                player2: {
                    inPlay: ['kakita-yoshi']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.katana = this.player1.findCardByName('fine-katana');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            expect(this.katana.parent).toBe(this.whisperer);
            this.context = this.game.getFrameworkContext(this.player1.player);
            this.chatEffect = (action) => {
                const [format, args] = action.getEffectMessage(this.context);
                this.game.addMessage(format, ...args);
                return this.getChatLog();
            };
        });

        it('names both bidders of a fate bid', function () {
            expect(this.chatEffect(this.game.actions.fateBid())).toBe(
                'have player1 and player2 select an amount of fate from their pool'
            );
        });

        it('names the honor bidders', function () {
            expect(this.chatEffect(this.game.actions.honorBid())).toBe(
                'have player1 and player2 select a value on their honor dial'
            );
            expect(this.chatEffect(this.game.actions.honorBid({ players: 'self' }))).toBe(
                'have player1 select a value on their honor dial'
            );
        });

        it('formats each part of a multiple action with its own arguments', function () {
            const player = this.player1.player;
            const action = this.game.actions.multiple([this.game.actions.draw({ target: player }), this.game.actions.gainFate({ target: player, amount: 2 })]);
            expect(this.chatEffect(action)).toBe('draw 1 card and gain 2 fate');
        });

        it('names nobody when giving honor in a bid', function () {
            expect(this.chatEffect(this.game.actions.honorBid({ giveHonor: true }))).toBe('bid honor');
        });

        it('names the new parent, the attachment and its old parent when giving control', function () {
            const action = this.game.actions.attach({ target: this.yoshi, attachment: this.katana, giveControl: true });
            expect(this.chatEffect(action)).toBe('give control of and attach Doji Whisperer\'s Fine Katana to Kakita Yoshi');
        });

        it('names the challenger first in a duel', function () {
            const action = this.game.actions.duel({
                type: 'military',
                challenger: this.whisperer,
                target: this.yoshi,
                gameAction: this.game.actions.bow()
            });
            expect(this.chatEffect(action)).toBe('initiate a military duel : Doji Whisperer vs. Kakita Yoshi');
        });
    });
});
