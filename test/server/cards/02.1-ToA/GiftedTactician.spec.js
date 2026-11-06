describe('Gifted Tactician', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['gifted-tactician', 'doji-whisperer', 'brash-samurai']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.tactician = this.player1.findCardByName('gifted-tactician');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.player1.reduceDeckToNumber('conflict deck', 5);
            this.noMoreActions();
        });

        it('draws 1 card after it wins a military conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.tactician],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tactician);
            this.player1.clickCard(this.tactician);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1.conflictDeck.length).toBe(4);
            expect(this.getChatLogs(5)).toContain('player1 uses Gifted Tactician to draw 1 card');
        });

        it('does not trigger after it loses a military conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.tactician],
                defenders: [this.berserker]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 2');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.hand.length).toBe(0);
        });

        it('does not trigger after it wins a political conflict', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.tactician, this.whisperer],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 4 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.hand.length).toBe(0);
        });

        it('does not trigger when it is not participating in the won military conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: ['brash-samurai'],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 2 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.hand.length).toBe(0);
        });
    });
});
