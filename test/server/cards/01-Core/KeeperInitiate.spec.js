describe('Keeper Initiate', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    role: 'keeper-of-air',
                    inPlay: ['doji-whisperer'],
                    hand: ['commune-with-the-spirits'],
                    dynastyDiscard: ['keeper-initiate']
                },
                player2: {
                    provinces: ['entrenched-position']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.initiate = this.player1.findCardByName('keeper-initiate');
        });

        function winConflictWith(ring) {
            this.noMoreActions();
            this.initiateConflict({
                province: 'entrenched-position',
                ring,
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.noMoreActions();
        }

        it('puts itself into play from the dynasty discard pile with 1 fate after claiming a matching ring', function() {
            this.player1.moveCard(this.initiate, 'dynasty discard pile');
            winConflictWith.call(this, 'air');
            this.player1.clickPrompt('Gain 2 Honor');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.initiate);
            this.player1.clickCard(this.initiate);

            expect(this.initiate.location).toBe('play area');
            expect(this.initiate.fate).toBe(1);
        });

        it('puts itself into play from a province with 1 fate after claiming a matching ring', function() {
            this.player1.placeCardInProvince(this.initiate, 'province 1');
            winConflictWith.call(this, 'air');
            this.player1.clickPrompt('Gain 2 Honor');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.initiate);

            expect(this.initiate.location).toBe('play area');
            expect(this.initiate.fate).toBe(1);
        });

        it('does not trigger after claiming a ring that does not match the role', function() {
            this.player1.moveCard(this.initiate, 'dynasty discard pile');
            winConflictWith.call(this, 'fire');
            this.player1.clickPrompt('Don\'t resolve');

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.initiate.location).toBe('dynasty discard pile');
        });

        it('does not trigger when a card claims another ring during a conflict on a matching ring', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: 'entrenched-position',
                ring: 'air',
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('commune-with-the-spirits');
            this.player1.clickRing('fire');

            expect(this.game.rings.fire.claimedBy).toBe(this.player1.player.name);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.initiate.location).toBe('dynasty discard pile');
        });
    });
});
