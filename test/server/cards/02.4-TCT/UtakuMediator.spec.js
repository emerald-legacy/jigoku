describe('Utaku Mediator', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['utaku-mediator']
                }
            });
            this.mediator = this.player1.findCardByName('utaku-mediator');
        });

        it('should get +1/+1 while you do not have the Imperial Favor', function() {
            expect(this.player1.player.imperialFavor).toBe('');
            expect(this.mediator.militarySkill).toBe(1);
            expect(this.mediator.politicalSkill).toBe(2);
        });

        it('should get +1/+1 while your opponent has the Imperial Favor', function() {
            this.player2.player.imperialFavor = 'military';
            this.game.checkGameState(true);
            expect(this.mediator.militarySkill).toBe(1);
            expect(this.mediator.politicalSkill).toBe(2);
        });

        it('should not get the bonus while you have the Imperial Favor', function() {
            this.player1.player.imperialFavor = 'political';
            this.game.checkGameState(true);
            expect(this.mediator.militarySkill).toBe(0);
            expect(this.mediator.politicalSkill).toBe(1);
        });
    });
});
