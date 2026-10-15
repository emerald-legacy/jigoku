describe('Ashigaru Encampment', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['ashigaru-encampment']
                }
            });
            this.ashigaruEncampment = this.player1.placeCardInProvince('ashigaru-encampment');
            this.ashigaruEncampment.facedown = false;
        });

        it('puts an Ashigaru into play', function () {
            this.player1.clickCard(this.ashigaruEncampment);
            const ashigaru = this.player1.player.cardsInPlay[0];
            expect(ashigaru.name).toBe('Ashigaru Recruit');
            expect(ashigaru.militarySkill).toBe(1);
            expect(ashigaru.politicalSkill).toBe(0);
            expect(ashigaru.glory).toBe(1);
            expect(ashigaru.isFaction('lion')).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Ashigaru Encampment to recruit Ashigaru Recruit');
        });

        it('cannot be used with an empty dynasty deck', function () {
            this.player1.reduceDeckToNumber('dynasty deck', 0);
            this.player1.clickCard(this.ashigaruEncampment);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.player.cardsInPlay.length).toBe(0);
        });
    });
});
