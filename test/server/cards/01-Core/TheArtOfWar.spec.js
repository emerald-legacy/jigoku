describe('The Art of War', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'akodo-gunso']
                },
                player2: {
                    conflictDeckSize: 4,
                    provinces: ['the-art-of-war', 'manicured-garden']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.artOfWar = this.player2.findCardByName('the-art-of-war');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.noMoreActions();
        });

        it('draws 3 cards when it is broken', function() {
            expect(this.player2.hand.length).toBe(0);
            expect(this.player2.conflictDeck.length).toBe(4);
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: this.artOfWar,
                attackers: [this.challenger, this.gunso],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.artOfWar);
            this.player2.clickCard(this.artOfWar);
            expect(this.artOfWar.isBroken).toBe(true);
            expect(this.player2.hand.length).toBe(3);
            expect(this.player2.conflictDeck.length).toBe(1);
        });

        it('does not trigger when another province is broken', function() {
            this.artOfWar.facedown = false;
            expect(this.player2.hand.length).toBe(0);
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: this.garden,
                attackers: [this.challenger, this.gunso],
                defenders: []
            });
            this.noMoreActions();
            expect(this.garden.isBroken).toBe(true);
            expect(this.artOfWar.isBroken).toBe(false);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.hand.length).toBe(0);
            expect(this.player2.conflictDeck.length).toBe(4);
        });
    });
});
