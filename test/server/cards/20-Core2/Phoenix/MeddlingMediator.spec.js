describe('Meddling Mediator', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    honor: 10,
                    inPlay: ['doji-challenger', 'doji-whisperer']
                },
                player2: {
                    fate: 5,
                    honor: 10,
                    inPlay: ['meddling-mediator', 'kitsuki-shomon']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.mediator = this.player2.findCardByName('meddling-mediator');
            this.shomon = this.player2.findCardByName('kitsuki-shomon');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer],
                defenders: [this.shomon]
            });
        });

        it('cannot be used after only 1 conflict was declared against you', function() {
            this.player2.clickCard(this.mediator);

            expect(this.player1.fate).toBe(5);
            expect(this.player2.fate).toBe(5);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('takes 1 fate or 1 honor once an opponent declared 2 conflicts against you', function() {
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 0');
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: [this.challenger],
                defenders: []
            });

            this.player2.clickCard(this.mediator);
            expect(this.player2).toHavePromptButton('Take 1 fate');
            expect(this.player2).toHavePromptButton('Take 1 honor');
            this.player2.clickPrompt('Take 1 fate');
            expect(this.player1.fate).toBe(4);
            expect(this.player2.fate).toBe(6);
            expect(this.player1.honor).toBe(10);
            expect(this.getChatLogs(3)).toContain('player2 uses Meddling Mediator to take 1 fate from player1');
        });
    });
});
