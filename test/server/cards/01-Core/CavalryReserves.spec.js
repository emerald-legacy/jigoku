
describe('Cavalry Reserves', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['Adept of the Waves'],
                    hand: ['Cavalry Reserves'],
                    dynastyDiscard: ['Border Rider', 'Border Rider', 'Border Rider', 'Moto Horde', 'Moto Juro', 'Doji Whisperer']
                },
                player2: {
                    inPlay: []
                }
            });
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: ['Adept of the Waves'],
                defenders: []
            });
            this.rider1 = this.player1.dynastyDiscard[0];
            this.rider2 = this.player1.dynastyDiscard[1];
            this.rider3 = this.player1.dynastyDiscard[2];
            this.horde = this.player1.dynastyDiscard[3];
            this.juro = this.player1.dynastyDiscard[4];
            this.noncavalry = this.player1.dynastyDiscard[5];
            this.reserves = this.player1.hand[0];
            this.player2.pass();
        });

        describe('When playing Cavalry Reserves', function() {
            beforeEach(function() {
                this.player1.clickCard(this.reserves, 'hand');
            });

            it('should prompt the player with the effect', function() {
                expect(this.player1).toHavePrompt('Cavalry Reserves');
            });

            it('should be able to target only cavalry', function() {
                expect(this.player1).toBeAbleToSelect(this.rider1);
                expect(this.player1).toBeAbleToSelect(this.horde);
                expect(this.player1).toBeAbleToSelect(this.juro);
                expect(this.player1).not.toBeAbleToSelect(this.noncavalry);
            });

            it('should let the player select multiple characters', function() {
                this.player1.clickCard(this.rider1);
                this.player1.clickCard(this.rider2);
                this.player1.clickCard(this.rider3);
                expect(this.player1.selectedCards.length).toBe(3);
            });

            it('should not let the player select more than 6 cost', function() {
                this.player1.clickCard(this.juro);
                this.player1.clickCard(this.horde);
                expect(this.player1.selectedCards).toContain(this.juro);
                expect(this.player1.selectedCards).not.toContain(this.horde);
            });

            it('should put selected cards into play', function() {
                this.player1.clickCard(this.rider1);
                this.player1.clickCard(this.rider2);
                this.player1.clickCard(this.rider3);
                this.player1.clickPrompt('Done');
                expect(this.rider1.location).toBe('play area');
                expect(this.rider2.location).toBe('play area');
                expect(this.rider3.location).toBe('play area');
            });
        });
    });
});

describe('Cavalry Reserves in a political conflict', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['cavalry-reserves'],
                    dynastyDiscard: ['border-rider']
                }
            });
            this.reserves = this.player1.findCardByName('cavalry-reserves');
            this.rider = this.player1.findCardByName('border-rider');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: ['adept-of-the-waves'],
                defenders: []
            });
            this.player2.pass();
        });

        it('cannot be played', function() {
            this.player1.clickCard(this.reserves);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.reserves.location).toBe('hand');
            expect(this.rider.location).toBe('dynasty discard pile');
        });
    });
});
