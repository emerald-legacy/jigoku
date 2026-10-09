describe('ability max', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-outrider', 'doji-whisperer'],
                    hand: ['strange-mirror'],
                    fate: 10
                },
                player2: {
                    inPlay: ['doji-challenger', 'brash-samurai'],
                    hand: ['assassination'],
                    fate: 10
                }
            });
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.mirror = this.player1.findCardByName('strange-mirror');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.assassination = this.player2.findCardByName('assassination');

            this.player1.playAttachment(this.mirror, this.outrider);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: [this.challenger]
            });
        });

        it('counts for the player who uses a copy they don\'t own', function() {
            const maxIdentifier = this.assassination.abilities.actions[0].maxIdentifier;
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.whisperer);
            expect(this.player2.player.isAbilityAtMax(maxIdentifier)).toBe(true);
            expect(this.player1.player.isAbilityAtMax(maxIdentifier)).toBe(false);

            this.player1.clickCard(this.mirror);
            this.player1.clickCard(this.mirror);
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.brash);

            expect(this.brash.location).toBe('dynasty discard pile');
            expect(this.player1.player.isAbilityAtMax(maxIdentifier)).toBe(true);
        });
    });
});
