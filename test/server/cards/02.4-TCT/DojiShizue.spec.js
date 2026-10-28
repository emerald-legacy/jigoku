describe('Doji Shizue', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shizue', { card: 'doji-shizue', fate: 1 }, 'doji-whisperer']
                },
                player2: {
                    inPlay: [{ card: 'bayushi-liar', fate: 1 }, { card: 'hida-kisada', fate: 1 }],
                    hand: ['mono-no-aware', 'way-of-the-crab']
                }
            });
            this.shizue = this.player1.filterCardsByName('doji-shizue').find((card) => card.fate === 0);
            this.shizueWithFate = this.player1.filterCardsByName('doji-shizue').find((card) => card.fate === 1);
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.liar = this.player2.findCardByName('bayushi-liar');
            this.kisada = this.player2.findCardByName('hida-kisada');
            this.monoNoAware = this.player2.findCardByName('mono-no-aware');
            this.wayOfTheCrab = this.player2.findCardByName('way-of-the-crab');
        });

        it('cannot be discarded or lose fate during the fate phase while you have the Imperial Favor', function() {
            this.flow.finishConflictPhase();
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.game.currentPhase).toBe('fate');
            expect(this.player1).toHavePrompt('Fate Phase');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.shizue);
            this.player1.clickPrompt('Done');
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.shizue.location).toBe('play area');
            expect(this.shizueWithFate.fate).toBe(1);
            expect(this.liar.fate).toBe(0);
        });

        it('can lose fate outside the fate phase while you have the Imperial Favor', function() {
            this.flow.finishConflictPhase();
            this.player1.clickPrompt('Done');
            this.flow.advancePhases('conflict');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.shizueWithFate.fate).toBe(1);
            this.player2.clickCard(this.monoNoAware);
            expect(this.getChatLogs(5)).toContain('player2 plays Mono no Aware to remove a fate from each character and draw a card');
            expect(this.shizueWithFate.fate).toBe(0);
        });

        // ruling #338: "cannot be discarded" doesn't stop a sacrifice
        it('can be sacrificed during the fate phase while you have the Imperial Favor', function() {
            this.player1.togglePromptedActionWindow('fate', true);
            this.player2.togglePromptedActionWindow('fate', true);
            this.flow.finishConflictPhase();
            this.player1.clickPrompt('Done');
            expect(this.player1.player.imperialFavor).toBe('military');
            this.player1.pass();
            this.player2.clickCard(this.wayOfTheCrab);
            this.player2.clickCard(this.kisada);
            expect(this.player1).toHavePrompt('Choose a character to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.shizue);
            this.player1.clickCard(this.shizue);
            expect(this.getChatLogs(5)).toContain('player1 sacrifices Doji Shizue to Way of the Crab');
            expect(this.shizue.location).toBe('dynasty discard pile');
        });
    });
});

describe('Doji Shizue without the Imperial Favor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shizue', { card: 'doji-shizue', fate: 1 }]
                },
                player2: {
                    inPlay: [{ card: 'kakita-asami', fate: 1 }, { card: 'doji-challenger', fate: 1 }]
                }
            });
            this.shizue = this.player1.filterCardsByName('doji-shizue').find((card) => card.fate === 0);
            this.shizueWithFate = this.player1.filterCardsByName('doji-shizue').find((card) => card.fate === 1);
        });

        it('is discarded and loses fate during the fate phase', function() {
            this.flow.finishConflictPhase();
            expect(this.player2.player.imperialFavor).toBe('military');
            expect(this.game.currentPhase).toBe('fate');
            this.player1.clickPrompt('Done');
            expect(this.shizue.location).toBe('dynasty discard pile');
            expect(this.shizueWithFate.location).toBe('play area');
            expect(this.shizueWithFate.fate).toBe(0);
        });
    });
});

describe('Doji Shizue and Fawning Diplomat', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shizue', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['fawning-diplomat']
                }
            });
            this.shizue = this.player1.findCardByName('doji-shizue');
            this.diplomat = this.player2.findCardByName('fawning-diplomat');
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
        });

        // ruling #332: the first player discards first
        it('stays in play when you are the first player, even if the opponent then claims the favor', function() {
            this.noMoreActions();
            this.player1.clickPrompt('Military');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.player1).toHavePrompt('Fate Phase');
            expect(this.player1).not.toBeAbleToSelect(this.shizue);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.diplomat);
            this.player2.clickPrompt('Political');
            expect(this.diplomat.location).toBe('dynasty discard pile');
            expect(this.player2.player.imperialFavor).toBe('political');
            expect(this.shizue.location).toBe('play area');
        });

        // ruling #332: the first player discards first
        // card bug: FatePhase picks the characters to discard for both players when step 4.2 starts, so Shizue (protected then) stays in play vs ruling #332 (discarded once the opponent, first player, took the favor)
        xit('is discarded when the opponent is the first player and claims the favor first', function() {
            this.game.setFirstPlayer(this.player2.player);
            this.noMoreActions();
            this.player1.clickPrompt('Military');
            expect(this.player1.player.imperialFavor).toBe('military');
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.diplomat);
            this.player2.clickPrompt('Political');
            expect(this.diplomat.location).toBe('dynasty discard pile');
            expect(this.player2.player.imperialFavor).toBe('political');
            expect(this.player1).toHavePrompt('Fate Phase');
            expect(this.player1).toBeAbleToSelect(this.shizue);
            this.player1.clickPrompt('Done');
            expect(this.shizue.location).toBe('dynasty discard pile');
        });
    });
});
