describe('Miya Kogara', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-kogara', 'brash-samurai']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });

            this.kogara = this.player1.findCardByName('miya-kogara');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.kogara.fate = 1;
            this.brashSamurai.fate = 1;
            this.whisperer.fate = 1;
        });

        it('should contribute its glory to the glory count while bowed', function() {
            this.kogara.bowed = true;
            this.brashSamurai.bowed = true;
            expect(this.player1.player.getGloryCount()).toBe(2);
            expect(this.player2.player.getGloryCount()).toBe(1);
            this.flow.finishConflictPhase();
            expect(this.getChatLogs(10)).toContain('player1 wins the glory count 2 vs 1');
        });

        it('should gain 1 fate and draw 1 card when it leaves play', function() {
            this.kogara.fate = 0;
            this.flow.finishConflictPhase();
            const fate = this.player1.fate;
            const handSize = this.player1.hand.length;
            this.player1.clickPrompt('Done');
            expect(this.getChatLogs(5)).toContain('player1 gains a fate due to Miya Kogara\'s Courtesy');
            expect(this.getChatLogs(5)).toContain('player1 draws a card due to Miya Kogara\'s Sincerity');
            expect(this.kogara.location).toBe('dynasty discard pile');
            expect(this.player1.fate).toBe(fate + 1);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });
    });
});
