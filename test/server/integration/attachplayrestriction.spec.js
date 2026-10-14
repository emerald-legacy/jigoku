describe('Restrictions on playing attachments', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'isawa-tadaka-2', attachments: ['tsangusuri-ward'] }],
                    hand: ['fine-katana']
                },
                player2: {
                    honor: 10,
                    inPlay: ['kakita-yoshi'],
                    hand: ['stinger', 'ornate-fan']
                }
            });

            this.tadaka = this.player1.findCardByName('isawa-tadaka-2');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.stinger = this.player2.findCardByName('stinger');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tadaka],
                defenders: [this.yoshi]
            });
        });

        it('stop an attachment from being played on the character', function () {
            this.player2.clickCard(this.fan);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.tadaka);
        });

        it('don\'t stop an attachment from being put into play on the character', function () {
            this.player2.clickCard(this.stinger);
            expect(this.player2).toBeAbleToSelect(this.tadaka);
            this.player2.clickCard(this.tadaka);
            expect(this.tadaka.attachments).toContain(this.stinger);
        });
    });
});
