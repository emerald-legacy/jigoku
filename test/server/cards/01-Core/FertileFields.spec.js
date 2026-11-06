describe('Fertile Fields', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    provinces: ['fertile-fields']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.fertileFields = this.player2.findCardByName('fertile-fields');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('draws 1 card during a conflict at this province', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.fertileFields,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            const topCard = this.player2.conflictDeck[0];
            expect(this.player2.hand.length).toBe(0);
            this.player2.clickCard(this.fertileFields);
            expect(topCard.location).toBe('hand');
            expect(this.player2.hand.length).toBe(1);
        });

        it('cannot be used during a conflict at another province', function() {
            this.fertileFields.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.otherProvince,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.fertileFields);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.hand.length).toBe(0);
        });

        it('cannot be used outside a conflict', function() {
            this.fertileFields.facedown = false;
            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.fertileFields);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.player2.hand.length).toBe(0);
        });
    });
});
