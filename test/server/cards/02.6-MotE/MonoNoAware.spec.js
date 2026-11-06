describe('Mono no Aware', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: [{ card: 'kakita-asami', fate: 3 }, 'doji-whisperer'],
                    hand: ['mono-no-aware', 'mono-no-aware']
                },
                player2: {
                    inPlay: [{ card: 'bayushi-liar', fate: 1 }, { card: 'brash-samurai', fate: 4 }]
                }
            });
            this.asami = this.player1.findCardByName('kakita-asami');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.liar = this.player2.findCardByName('bayushi-liar');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.mono = this.player1.filterCardsByName('mono-no-aware')[0];
            this.otherMono = this.player1.filterCardsByName('mono-no-aware')[1];
        });

        it('removes 1 fate from each character and draws 1 card', function() {
            const handSize = this.player1.hand.length;
            this.player1.clickCard(this.mono);
            expect(this.getChatLogs(5)).toContain('player1 plays Mono no Aware to remove a fate from each character and draw a card');
            expect(this.asami.fate).toBe(2);
            expect(this.whisperer.fate).toBe(0);
            expect(this.liar.fate).toBe(0);
            expect(this.brash.fate).toBe(3);
            expect(this.mono.location).toBe('conflict discard pile');
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player1.fate).toBe(7);
        });

        it('can only be played once per round', function() {
            this.player1.clickCard(this.mono);
            expect(this.asami.fate).toBe(2);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.otherMono);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.otherMono.location).toBe('hand');
            expect(this.asami.fate).toBe(2);
        });

        it('can be played again in the next round', function() {
            this.player1.clickCard(this.mono);
            expect(this.asami.fate).toBe(2);
            this.flow.finishConflictPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.flow.advancePhases('conflict');
            expect(this.asami.fate).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.otherMono);
            expect(this.otherMono.location).toBe('conflict discard pile');
            expect(this.asami.fate).toBe(0);
        });
    });
});
