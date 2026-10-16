describe('Burnished Reputation', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso', 'doji-whisperer'],
                    hand: ['burnished-reputation']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'doji-challenger']
                }
            });
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.burnished = this.player1.findCardByName('burnished-reputation');
        });

        it('should honor a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gunso],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.burnished);
            expect(this.player1).toHavePrompt('Burnished Reputation');
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.isHonored).toBe(true);
        });

        it('should not be playable outside a conflict', function() {
            this.player1.clickCard(this.burnished);
            expect(this.burnished.location).toBe('hand');
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
