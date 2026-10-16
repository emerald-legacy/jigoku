describe('Grasp of Earth', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-esoterica'],
                    hand: ['grasp-of-earth']
                }
            });

            this.student = this.player1.findCardByName('student-of-esoterica');
            this.grasp = this.player1.findCardByName('grasp-of-earth');
        });

        it('costs 1 fate with Earth affinity', function () {
            expect(this.player1.player.hasAffinity('earth')).toBe(true);
            const fate = this.player1.fate;
            this.player1.playAttachment(this.grasp, this.student);
            expect(this.grasp.parent).toBe(this.student);
            expect(this.player1.fate).toBe(fate - 1);
        });
    });
});
