describe('Student of the Method', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['student-of-the-method']
                }
            });
            this.student = this.player1.findCardByName('student-of-the-method');
        });

        it('gets +2 military and +2 political while the honor bids are equal', function() {
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('2');
            this.noMoreActions();

            expect(this.game.currentPhase).toBe('conflict');
            expect(this.student.getMilitarySkill()).toBe(3);
            expect(this.student.getPoliticalSkill()).toBe(3);
        });

        it('gets no bonus while the honor bids differ', function() {
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');
            this.noMoreActions();

            expect(this.game.currentPhase).toBe('conflict');
            expect(this.player1.player.showBid).toBe(1);
            expect(this.student.getMilitarySkill()).toBe(1);
            expect(this.student.getPoliticalSkill()).toBe(1);
        });
    });
});
