describe('Steadfast Samurai', function () {
    integration(function () {
        describe('with at least 5 more honor than the opponent', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['steadfast-samurai', 'doji-whisperer']
                    },
                    player2: {
                        honor: 6
                    }
                });
                this.samurai = this.player1.findCardByName('steadfast-samurai');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.whisperer.fate = 1;
            });

            it('is not discarded for having no fate', function () {
                this.flow.finishConflictPhase();

                expect(this.game.currentPhase).toBe('fate');
                expect(this.samurai.location).toBe('play area');
                expect(this.getChatLogs(10)).toContain('player1 uses Steadfast Samurai to stop him being discarded or losing fate in this phase');
            });

            it('does not lose fate', function () {
                this.samurai.fate = 2;
                this.flow.finishConflictPhase();

                expect(this.game.currentPhase).toBe('fate');
                expect(this.samurai.fate).toBe(2);
                expect(this.whisperer.fate).toBe(0);
            });
        });

        describe('with fewer than 5 more honor than the opponent', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['steadfast-samurai']
                    },
                    player2: {
                        honor: 6
                    }
                });
                this.samurai = this.player1.findCardByName('steadfast-samurai');
            });

            it('is discarded for having no fate', function () {
                this.flow.finishConflictPhase();

                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.samurai.location).toBe('dynasty discard pile');
            });

            it('loses fate', function () {
                this.samurai.fate = 2;
                this.flow.finishConflictPhase();

                expect(this.game.currentPhase).toBe('fate');
                expect(this.samurai.fate).toBe(1);
            });
        });

        describe('when the opponent has 5 more honor', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 6,
                        inPlay: ['steadfast-samurai']
                    },
                    player2: {
                        honor: 11
                    }
                });
                this.samurai = this.player1.findCardByName('steadfast-samurai');
            });

            it('loses fate', function () {
                this.samurai.fate = 2;
                this.flow.finishConflictPhase();

                expect(this.game.currentPhase).toBe('fate');
                expect(this.samurai.fate).toBe(1);
            });
        });
    });
});
