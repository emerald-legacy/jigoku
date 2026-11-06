describe('Kitsuki Counselor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['kitsuki-counselor']
                }
            });
            this.counselor = this.player1.findCardByName('kitsuki-counselor');
        });

        it('should correctly modify both skills', function() {
            expect(this.counselor.militarySkill).toBe(1);
            expect(this.counselor.politicalSkill).toBe(1);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');
            expect(this.counselor.militarySkill).toBe(2);
            expect(this.counselor.politicalSkill).toBe(2);
        });
    });
});
