describe('Restoration of Balance', function() {
    integration(function() {
        describe('Restoration of Balance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi'],
                        hand: [
                            'against-the-waves', 'fine-katana', 'ornate-fan', 'honored-blade',
                            'magnificent-kimono', 'assassination', 'banzai', 'charge'
                        ]
                    },
                    player2: {
                        provinces: ['restoration-of-balance']
                    }
                });
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoToturi],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickCard('restoration-of-balance');
            });

            it('should prompt the opponent to discard down to four cards', function() {
                expect(this.player1).toHavePrompt('Choose 4 cards to discard');
                expect(this.player1).toBeAbleToSelect('assassination');
                expect(this.player1).toBeAbleToSelect('charge');
            });

            it('should discard the chosen cards', function() {
                this.assassination = this.player1.clickCard('assassination');
                this.fineKatana = this.player1.clickCard('fine-katana');
                this.charge = this.player1.clickCard('charge');
                this.banzai = this.player1.clickCard('banzai');
                this.player1.clickPrompt('Done');
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.charge.location).toBe('conflict discard pile');
                expect(this.banzai.location).toBe('conflict discard pile');
                expect(this.player1.hand.length).toBe(4);
            });
        });
    });
});

describe('Restoration of Balance with 4 cards in hand', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi'],
                    hand: ['fine-katana', 'ornate-fan', 'assassination', 'banzai']
                },
                player2: {
                    provinces: ['restoration-of-balance']
                }
            });
            this.akodoToturi = this.player1.findCardByName('akodo-toturi');
            this.restoration = this.player2.findCardByName('restoration-of-balance');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoToturi],
                defenders: [],
                province: this.restoration
            });
            this.noMoreActions();
        });

        it('does not trigger', function() {
            expect(this.restoration.isBroken).toBe(true);
            expect(this.player2).not.toBeAbleToSelect(this.restoration);
            expect(this.player1.hand.length).toBe(4);
        });
    });
});
