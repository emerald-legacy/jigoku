describe('The Imperial Palace', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'radiant-orator'],
                    dynastyDeck: ['the-imperial-palace']
                },
                player2: {
                    inPlay: ['doji-challenger', 'matsu-berserker', 'doji-whisperer']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.orator = this.player1.findCardByName('radiant-orator');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.berserker = this.player2.findCardByName('matsu-berserker');
        });

        it('adds 3 to your side of the glory count', function() {
            this.palace = this.player1.placeCardInProvince('the-imperial-palace', 'province 1');
            this.flow.finishConflictPhase();
            expect(this.getChatLogs(5)).toContain('player1 wins the glory count 6 vs 4');
            expect(this.player1.player.imperialFavor).toBe('military');
        });

        it('adds nothing while it is not in a province', function() {
            this.palace = this.player1.moveCard('the-imperial-palace', 'dynasty discard pile');
            this.flow.finishConflictPhase();
            expect(this.getChatLogs(5)).toContain('player2 wins the glory count 4 vs 3');
            expect(this.player2.player.imperialFavor).toBe('military');
        });

        // ruling #272: Radiant Orator does not count The Imperial Palace
        it('is not counted by Radiant Orator', function() {
            this.palace = this.player1.placeCardInProvince('the-imperial-palace', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.orator],
                defenders: [this.challenger]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.orator);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.challenger.isParticipating()).toBe(true);
        });
    });
});
