describe('Playing a character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['isawa-skycaller'],
                    dynastyDiscard: ['bake-kujira']
                }
            });
            this.skycaller = this.player1.findCardByName('isawa-skycaller');
            this.kujira = this.player1.placeCardInProvince('bake-kujira', 'province 1');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skycaller],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
        });

        it('can\'t play a Legendary character outside the Dynasty phase', function() {
            this.player1.clickCard(this.kujira);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.kujira.location).toBe('province 1');
        });
    });
});


describe('Playing a character into the conflict', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['isawa-skycaller'],
                    dynastyDiscard: ['matsu-berserker']
                }
            });
            this.skycaller = this.player1.findCardByName('isawa-skycaller');
            this.berserker = this.player1.placeCardInProvince('matsu-berserker', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.skycaller],
                defenders: []
            });
            this.player2.pass();
        });

        it('isn\'t offered when the character can\'t go into the conflict', function() {
            this.player1.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.location).toBe('province 1');
        });
    });
});
