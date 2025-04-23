describe('Retreat to Safety', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'kitsu-motso', 'ikoma-prodigy'],
                    hand: ['retreat-to-safety']
                }
            });

            this.borderRider = this.player1.findCardByName('border-rider');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.kitsuMotso = this.player2.findCardByName('kitsu-motso');
            this.ikomaProdigy = this.player2.findCardByName('ikoma-prodigy');
            this.retreatToSafety = this.player2.findCardByName('retreat-to-safety');
            this.ikomaProdigy.bowed = true;
        });

        it('sends defenders home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.matsuBerserker, this.kitsuMotso]
            });
            this.matsuBerserker.bowed = true;
            this.kitsuMotso.bowed = true;

            this.player2.clickCard(this.retreatToSafety);
            expect(this.player2).toHavePrompt('Retreat to Safety');
            expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player2).toBeAbleToSelect(this.kitsuMotso);

            this.player2.clickCard(this.matsuBerserker);
            this.player2.clickCard(this.kitsuMotso);
            this.player2.clickPrompt('Done');
            expect(this.matsuBerserker.isParticipating()).toBe(false);
            expect(this.kitsuMotso.isParticipating()).toBe(false);
            expect(this.getChatLogs(3)).toContain(
                'player2 plays Retreat to Safety to send Matsu Berserker and Kitsu Motso home'
            );

            expect(this.player2).toHavePrompt('Choose a character to ready');
            expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player2).toBeAbleToSelect(this.kitsuMotso);
            expect(this.player2).not.toBeAbleToSelect(this.ikomaProdigy);

            this.player2.clickCard(this.matsuBerserker);
            expect(this.getChatLogs(3)).toContain("Matsu Berserker is readied due to player2's superior leadership");
            expect(this.matsuBerserker.bowed).toBe(false);
            expect(this.kitsuMotso.bowed).toBe(true);
        });
    });
});
