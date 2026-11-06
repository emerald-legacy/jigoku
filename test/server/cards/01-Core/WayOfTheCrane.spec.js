describe('Way of the Crane', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'matsu-berserker'],
                    hand: ['way-of-the-crane']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('honors a Crane character you control', function() {
            this.player1.clickCard(this.crane);
            expect(this.player1).toHavePrompt('Way of the Crane');
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isHonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 plays Way of the Crane to honor Doji Whisperer');
        });

        it('cannot choose a non-Crane character', function() {
            this.player1.clickCard(this.crane);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
        });

        it('cannot choose a Crane character controlled by the opponent', function() {
            this.player1.clickCard(this.crane);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });
    });
});
