describe('Hito District', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['chasing-the-sun']
                },
                player2: {
                    provinces: ['rally-to-the-cause', 'shameful-display'],
                    dynastyDeck: ['hito-district']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.rally = this.player2.findCardByName('rally-to-the-cause', 'province 1');
            this.display = this.player2.findCardByName('shameful-display', 'province 2');
            this.hito = this.player2.placeCardInProvince('hito-district', 'province 1');
            this.noMoreActions();
        });

        it('prevents political conflicts from being declared against its province', function() {
            this.player1.clickRing('air');
            expect(this.game.currentConflict.conflictType).toBe('military');
            this.player1.clickRing('air');
            expect(this.game.currentConflict.conflictType).toBe('political');
            this.player1.clickCard(this.rally);
            expect(this.rally.inConflict).toBe(false);
            this.player1.clickCard(this.display);
            expect(this.display.inConflict).toBe(true);
        });

        it('allows military conflicts to be declared against its province', function() {
            this.player1.clickRing('air');
            expect(this.game.currentConflict.conflictType).toBe('military');
            this.player1.clickCard(this.rally);
            expect(this.rally.inConflict).toBe(true);
            this.player1.clickRing('air');
            expect(this.game.currentConflict.conflictType).toBe('military');
            expect(this.game.currentConflict.conflictProvince).toBe(this.rally);
        });

        // ruling #190: a military conflict against its province can be switched to political
        it('does not stop a declared military conflict from being switched to political', function() {
            this.initiateConflict({
                type: 'military',
                province: this.rally,
                attackers: [this.brash]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.rally);
            expect(this.game.currentConflict.conflictType).toBe('political');
            expect(this.game.currentConflict.conflictProvince).toBe(this.rally);
        });

        // ruling #245: Chasing the Sun can move a political conflict to its province
        it('does not stop a political conflict from being moved to its province', function() {
            this.initiateConflict({
                type: 'political',
                province: this.display,
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('chasing-the-sun');
            expect(this.player1).toBeAbleToSelect(this.rally);
            this.player1.clickCard(this.rally);
            expect(this.game.currentConflict.conflictType).toBe('political');
            expect(this.game.currentConflict.conflictProvince).toBe(this.rally);
        });
    });
});
