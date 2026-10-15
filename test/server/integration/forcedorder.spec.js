describe('forced abilities triggering at the same moment', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asako-tsuki', 'doji-challenger'],
                    hand: ['prayers-on-the-eve-of-battle', 'prayers-on-the-eve-of-battle']
                },
                player2: {
                    inPlay: ['borderlands-defender'],
                    hand: ['prayers-on-the-eve-of-battle']
                }
            });
            this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.borderlands = this.player2.findCardByName('borderlands-defender');
            [this.prayers1, this.prayers1b] = this.player1.filterCardsByName('prayers-on-the-eve-of-battle');
            this.prayers2 = this.player2.findCardByName('prayers-on-the-eve-of-battle');
        });

        it('are ordered by the first player when they belong to different players', function() {
            this.player1.playAttachment(this.prayers1, this.asakoTsuki);
            this.player2.playAttachment(this.prayers2, this.borderlands);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.asakoTsuki],
                defenders: [this.borderlands]
            });
            this.noMoreActions();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.prayers1);
            expect(this.player1).toBeAbleToSelect(this.prayers2);
            this.player1.clickCard(this.prayers2);
            expect(this.prayers2.location).toBe('conflict discard pile');
            expect(this.prayers1.location).toBe('removed from game');
        });

        it('resolve in the default order when they all belong to one player', function() {
            this.player1.playAttachment(this.prayers1, this.asakoTsuki);
            this.player2.pass();
            this.player1.playAttachment(this.prayers1b, this.challenger);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.asakoTsuki, this.challenger],
                defenders: [this.borderlands]
            });
            this.noMoreActions();

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.prayers1.location).toBe('conflict discard pile');
            expect(this.prayers1b.location).toBe('conflict discard pile');
        });
    });
});
