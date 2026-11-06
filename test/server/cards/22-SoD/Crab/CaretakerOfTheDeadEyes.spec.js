describe('Caretaker of the Dead Eyes', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['caretaker-of-the-dead-eyes', 'hiruma-harrower', 'kaiu-envoy'],
                    hand: ['armor-of-the-fallen'],
                    dynastyDiscard: ['matsu-berserker']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['assassination']
                }
            });
            this.caretaker = this.player1.findCardByName('caretaker-of-the-dead-eyes');
            this.harrower = this.player1.findCardByName('hiruma-harrower');
            this.envoy = this.player1.findCardByName('kaiu-envoy');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.envoy.dishonor();
            this.player1.playAttachment('armor-of-the-fallen', this.harrower);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.harrower, this.envoy],
                defenders: [this.whisperer]
            });
        });

        it('honors a dishonored Bushi leaving play', function() {
            this.player2.clickCard('assassination');
            this.player2.clickCard(this.envoy);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.caretaker);
            this.player1.clickCard(this.caretaker);
            expect(this.envoy.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Caretaker of the Dead Eyes to honor Kaiu Envoy');
        });

        it('does not trigger for characters that were not in play', function() {
            this.player2.pass();
            this.player1.clickCard(this.harrower);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.whisperer);
            expect(this.berserker.location).toBe('removed from game');
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
