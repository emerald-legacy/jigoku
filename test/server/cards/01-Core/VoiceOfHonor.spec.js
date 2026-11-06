describe('Voice of Honor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-whisperer', honor: 'honored' }, 'matsu-berserker'],
                    hand: ['voice-of-honor']
                },
                player2: {
                    honor: 10,
                    inPlay: ['brash-samurai'],
                    hand: ['assassination', 'assassination']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.voice = this.player1.findCardByName('voice-of-honor');
            this.brash = this.player2.findCardByName('brash-samurai');
            [this.assassination, this.assassination2] = this.player2.filterCardsByName('assassination', 'hand');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.brash]
            });
        });

        it('cancels the effects of an opponent\'s event while you control more honored characters', function() {
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.voice);
            this.player1.clickCard(this.voice);
            expect(this.voice.location).toBe('conflict discard pile');
            expect(this.whisperer.location).toBe('play area');
        });

        it('leaves the canceled event\'s cost paid and the event counted as used (ruling #120)', function() {
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.whisperer);
            this.player1.clickCard(this.voice);
            expect(this.whisperer.location).toBe('play area');
            expect(this.player2.honor).toBe(7);
            expect(this.assassination.location).toBe('conflict discard pile');
            this.player1.pass();
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.assassination2);
            expect(this.assassination2.location).toBe('hand');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.honor).toBe(7);
        });

        it('is not offered while you do not control more honored characters than your opponent', function() {
            this.player2.clickCard(this.brash);
            expect(this.brash.isHonored).toBe(true);
            this.player1.pass();
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.whisperer);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.voice.location).toBe('hand');
        });

        it('is not offered against a character ability', function() {
            this.player2.clickCard(this.brash);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.brash.isHonored).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.voice.location).toBe('hand');
        });
    });
});
