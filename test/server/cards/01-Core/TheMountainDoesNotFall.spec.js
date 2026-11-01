describe('The Mountain Does Not Fall', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'border-rider'],
                    hand: ['the-mountain-does-not-fall']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'akodo-gunso'],
                    hand: ['the-mountain-does-not-fall', 'the-mountain-does-not-fall'],
                    provinces: ['entrenched-position']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.p1Mountain = this.player1.findCardByName('the-mountain-does-not-fall');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.gunso = this.player2.findCardByName('akodo-gunso');
            [this.p2Mountain1, this.p2Mountain2] = this.player2.filterCardsByName('the-mountain-does-not-fall', 'hand');
        });

        function declare() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.challenger, this.borderRider],
                defenders: [this.whisperer, this.gunso]
            });
        }

        it('stops the chosen defending character from bowing as a result of conflict resolution', function() {
            this.noMoreActions();
            declare.call(this);
            this.player2.clickCard(this.p2Mountain1);
            expect(this.player2).toHavePrompt('The Mountain Does Not Fall');
            this.player2.clickCard(this.gunso);
            expect(this.getChatLogs(3)).toContain('player2 plays The Mountain Does Not Fall to make Akodo Gunsō not bow as a defender');
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 5 vs 2');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.gunso.bowed).toBe(false);
            expect(this.whisperer.bowed).toBe(true);
        });

        it('does not stop the chosen character from bowing as a result of conflict resolution while attacking', function() {
            this.noMoreActions();
            declare.call(this);
            this.player2.pass();
            this.player1.clickCard(this.p1Mountain);
            this.player1.clickCard(this.challenger);
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 5 vs 2');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.challenger.bowed).toBe(true);
            expect(this.borderRider.bowed).toBe(true);
        });

        it('lasts for the phase when played before the conflict', function() {
            this.player1.pass();
            this.player2.clickCard(this.p2Mountain1);
            this.player2.clickCard(this.gunso);
            this.noMoreActions();
            declare.call(this);
            this.noMoreActions();
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.gunso.bowed).toBe(false);
            expect(this.whisperer.bowed).toBe(true);
        });

        it('can be played only once per round', function() {
            this.noMoreActions();
            declare.call(this);
            this.player2.clickCard(this.p2Mountain1);
            this.player2.clickCard(this.gunso);
            expect(this.p2Mountain1.location).toBe('conflict discard pile');
            this.player1.pass();
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.p2Mountain2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.p2Mountain2.location).toBe('hand');
        });
    });
});
