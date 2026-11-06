describe('Hiruma Skirmisher', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['hiruma-skirmisher']
                }
            });
            this.skirmisher = this.player1.findCardByName('hiruma-skirmisher');
        });

        it('gains covert after you play it', function () {
            this.player1.clickCard(this.skirmisher);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.skirmisher);
        });
    });
});

describe('Hiruma Skirmisher put into play', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsu-spiritcaller', 'hida-kisada'],
                    conflictDiscard: ['hiruma-skirmisher']
                }
            });
            this.spiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.skirmisher = this.player1.findCardByName('hiruma-skirmisher');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kisada],
                defenders: []
            });
            this.player2.pass();
        });

        it('does not react when put into play', function () {
            this.player1.clickCard(this.spiritcaller);
            this.player1.clickCard(this.skirmisher);
            expect(this.skirmisher.location).toBe('play area');
            expect(this.skirmisher.isParticipating()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
