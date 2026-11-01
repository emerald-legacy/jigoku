describe('Incessant Moto', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['incessant-moto', 'doji-whisperer'],
                    conflictDiscard: ['banzai']
                },
                player2: {
                    inPlay: ['bayushi-kachiko-2']
                }
            });
            this.moto = this.player1.findCardByName('incessant-moto');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.kachiko = this.player2.findCardByName('bayushi-kachiko-2');
            this.banzai = this.player1.findCardByName('banzai');
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.kachiko],
                defenders: [this.whisperer]
            });
            this.player1.pass();
        });

        it('doesn\'t react to your event played by your opponent ("you play")', function () {
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.kachiko);
            if(this.player2.currentButtons.includes('Done')) {
                this.player2.clickPrompt('Done');
            }
            expect(this.getChatLogs(10)).toContain('player2 plays Banzai! from their opponent\'s conflict discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.moto.isParticipating()).toBe(false);
        });
    });
});

describe('Incessant Moto attachments', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['incessant-moto', 'doji-whisperer'],
                    hand: ['fine-katana', 'ornate-fan']
                },
                player2: {}
            });
            this.moto = this.player1.findCardByName('incessant-moto');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
        });

        it('can have a Weapon attached', function () {
            this.player1.clickCard(this.katana);
            expect(this.player1).toBeAbleToSelect(this.moto);
            this.player1.clickCard(this.moto);
            expect(this.katana.parent).toBe(this.moto);
        });

        it('cannot have a non-Weapon attachment attached', function () {
            this.player1.clickCard(this.fan);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.moto);
        });
    });
});
