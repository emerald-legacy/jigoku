describe('Kaiu Inventor', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator', 'doji-whisperer']
                },
                player2: {
                    dynastyDiscard: ['border-s-edge-barracks'],
                    inPlay: ['kaiu-inventor', 'asako-diplomat', 'doji-challenger', 'kakita-asami', 'doji-hotaru']
                }
            });
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.whisperer = this.player1.findCardByName('doji-whisperer');

            this.barracks = this.player2.placeCardInProvince('border-s-edge-barracks', 'province 1');
            this.inventor = this.player2.findCardByName('kaiu-inventor');
            this.diplomat = this.player2.findCardByName('asako-diplomat');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.hotaru = this.player2.findCardByName('doji-hotaru');
        });

        it('gives a once-per-conflict holding ability one additional use in the next conflict only', function () {
            this.player1.pass();
            this.player2.clickCard(this.inventor);
            this.player2.clickCard(this.barracks);
            expect(this.getChatLogs(3)).toContain('player2 uses Kaiu Inventor to add an additional use to each of Border\'s Edge Barracks\'s abilities');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.manipulator],
                defenders: []
            });
            this.player2.clickCard(this.barracks);
            this.player2.clickCard(this.diplomat);
            this.player1.pass();
            this.player2.clickCard(this.barracks);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.inConflict).toBe(true);
            this.player1.pass();
            this.player2.clickCard(this.barracks);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            this.player2.pass();
            this.player2.pass(); // Asako Diplomat's reaction
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.clickCard(this.barracks);
            this.player2.clickCard(this.asami);
            expect(this.asami.inConflict).toBe(true);
            this.player1.pass();
            this.player2.clickCard(this.barracks);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.hotaru.inConflict).toBe(false);
        });
    });
});
