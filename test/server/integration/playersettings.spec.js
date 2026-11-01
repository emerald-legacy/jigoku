describe('A player\'s settings in the game state', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict'
            });
            this.player1.player.user.settings = {
                background: 'BG1',
                windowTimer: 10,
                optionSettings: { markCardsUnselectable: true },
                timerSettings: { eventsInDeck: true }
            };
            this.player1.player.optionSettings = { markCardsUnselectable: true, showRingEffects: true };
            this.game.togglePromptedActionWindow('player1', 'fate', true);
            this.game.toggleTimerSetting('player1', 'eventsInDeck', true);
        });

        it('are sent to the player', function() {
            const own = this.game.getState('player1').players.player1;
            expect(own.promptedActionWindows.fate).toBe(true);
            expect(own.timerSettings.eventsInDeck).toBe(true);
            expect(own.optionSettings).toBe(this.player1.player.optionSettings);
            expect(own.user.settings.timerSettings.eventsInDeck).toBe(true);
            expect(own.user.settings.windowTimer).toBe(10);
        });

        it('are not sent to the opponent, except the option to show ring effects', function() {
            const seen = this.game.getState('player2').players.player1;
            expect(seen.promptedActionWindows).toBeUndefined();
            expect(seen.timerSettings).toBeUndefined();
            expect(seen.optionSettings).toEqual({ showRingEffects: true });
            expect(seen.user.settings.optionSettings).toBeUndefined();
            expect(seen.user.settings.timerSettings).toBeUndefined();
            expect(seen.user.settings.windowTimer).toBeUndefined();
            expect(seen.user.settings.background).toBe('BG1');
        });
    });
});
