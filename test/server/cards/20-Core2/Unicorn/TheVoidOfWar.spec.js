describe('The Void of War', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    role: 'keeper-of-void',
                    inPlay: ['doji-challenger', 'matsu-berserker'],
                    hand: ['the-void-of-war']
                },
                player2: {
                    inPlay: ['kitsuki-shomon', 'doji-whisperer']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.voidOfWar = this.player1.findCardByName('the-void-of-war');
            this.shomon = this.player2.findCardByName('kitsuki-shomon');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('makes the opponent choose and bow a participating character they control', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger, this.berserker],
                defenders: [this.shomon, this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.voidOfWar);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.shomon);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            this.player2.clickCard(this.shomon);

            expect(this.shomon.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 plays The Void of War to bow Kitsuki Shomon');
            expect(this.player2).toHavePrompt('Resolve The Void of War\'s ability again?');
            this.player2.clickPrompt('No');
            expect(this.challenger.bowed).toBe(false);
            expect(this.berserker.bowed).toBe(false);
            expect(this.whisperer.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('passes back and forth until a player stops', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger, this.berserker],
                defenders: [this.shomon, this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.voidOfWar);
            this.player2.clickCard(this.shomon);
            this.player2.clickPrompt('Yes');

            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 resolves The Void of War to bow Matsu Berserker');

            expect(this.player1).toHavePrompt('Resolve The Void of War\'s ability again?');
            this.player1.clickPrompt('Yes');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);

            this.player2.clickPrompt('No');
            expect(this.challenger.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('stops when there is no participating character left to bow', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.shomon]
            });
            this.player2.pass();
            this.player1.clickCard(this.voidOfWar);
            this.player2.clickCard(this.shomon);
            this.player2.clickPrompt('Yes');
            this.player1.clickCard(this.challenger);

            expect(this.shomon.bowed).toBe(true);
            expect(this.challenger.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Resolve The Void of War\'s ability again?');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('cannot be played in a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: [this.shomon]
            });
            this.player2.pass();
            this.player1.clickCard(this.voidOfWar);

            expect(this.voidOfWar.location).toBe('hand');
            expect(this.shomon.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
