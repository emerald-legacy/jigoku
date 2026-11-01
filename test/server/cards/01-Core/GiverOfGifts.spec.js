describe('Giver of Gifts', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'giver-of-gifts',
                        { card: 'brash-samurai', attachments: ['ornate-fan'] },
                        'doji-whisperer',
                        'moto-horde'
                    ]
                },
                player2: {
                    inPlay: [{ card: 'kakita-asami', attachments: ['fine-katana'] }]
                }
            });
            this.giver = this.player1.findCardByName('giver-of-gifts');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.horde = this.player1.findCardByName('moto-horde');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.theirKatana = this.player2.findCardByName('fine-katana');
        });

        it('moves an attachment you control to another character you control', function() {
            this.player1.clickCard(this.giver);
            expect(this.player1).toBeAbleToSelect(this.fan);
            this.player1.clickCard(this.fan);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.fan.parent).toBe(this.whisperer);
            expect(this.whisperer.attachments).toContain(this.fan);
            expect(this.brash.attachments).not.toContain(this.fan);
        });

        it('cannot choose an attachment controlled by your opponent', function() {
            this.player1.clickCard(this.giver);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).not.toBeAbleToSelect(this.theirKatana);
        });

        it('cannot move the attachment to the same character or to an opponent\'s character', function() {
            this.player1.clickCard(this.giver);
            this.player1.clickCard(this.fan);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
        });

        it('cannot move the attachment to a character that is not eligible for it', function() {
            this.player1.clickCard(this.giver);
            this.player1.clickCard(this.fan);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.horde);
        });
    });
});
