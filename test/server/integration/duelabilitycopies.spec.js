describe('copied duel abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor']
                },
                player2: {
                    inPlay: ['prudent-challenger', 'doji-whisperer']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.prudentChallenger = this.player2.findCardByName('prudent-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('checks the copy\'s own challenger, not the original card', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.actor],
                defenders: [this.whisperer],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.prudentChallenger);
            this.player2.pass();

            this.player1.clickCard(this.actor);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
        });
    });
});

describe('a duel focus gained by Togashi Yokuni', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-yokuni'],
                    hand: ['policy-debate']
                },
                player2: {
                    inPlay: ['isawa-house-guard']
                }
            });
            this.yokuni = this.player1.findCardByName('togashi-yokuni');
            this.houseGuard = this.player2.findCardByName('isawa-house-guard');
            this.yokuni.honor();

            this.player1.clickCard(this.yokuni);
            this.player1.clickCard(this.houseGuard);
            this.player1.clickPrompt('Help a character with a duel');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yokuni],
                defenders: [this.houseGuard]
            });
            this.player2.pass();
        });

        it('is offered in Yokuni\'s duel', function() {
            this.player1.clickCard('policy-debate');
            this.player1.clickCard(this.yokuni);
            this.player1.clickCard(this.houseGuard);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yokuni);
        });
    });
});
