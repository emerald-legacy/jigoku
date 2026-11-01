describe('Yogo Outcast', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 8,
                    inPlay: ['yogo-outcast-2']
                },
                player2: {
                    honor: 11,
                    inPlay: ['doji-whisperer']
                }
            });
            this.outcast = this.player1.findCardByName('yogo-outcast-2');
        });

        it('should get +1/+1 while you are less honorable than your opponent', function() {
            expect(this.outcast.militarySkill).toBe(3);
            expect(this.outcast.politicalSkill).toBe(3);
        });

        it('should not get the bonus when you have equal honor', function() {
            this.player1.honor = 11;
            this.game.checkGameState(true);
            expect(this.outcast.militarySkill).toBe(2);
            expect(this.outcast.politicalSkill).toBe(2);
        });

        it('should not get the bonus when you are more honorable', function() {
            this.player1.honor = 14;
            this.game.checkGameState(true);
            expect(this.outcast.militarySkill).toBe(2);
            expect(this.outcast.politicalSkill).toBe(2);
        });
    });
});
