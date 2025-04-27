describe("A Swallow's Return", function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    conflictDiscard: [
                        'assassination',
                        'honored-blade',
                        'master-of-the-spear',
                        'ready-for-battle',
                        'captive-audience'
                    ]
                },
                player2: {
                    honor: 10,
                    fate: 4,
                    hand: ['a-swallow-s-return']
                }
            });

            this.swallowsReturn = this.player2.findCardByName('a-swallow-s-return');

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.assassination = this.player1.findCardByName('assassination');
            this.honoredBlade = this.player1.findCardByName('honored-blade');
            this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
            this.readyForBattle = this.player1.findCardByName('ready-for-battle');
            this.captiveAudience = this.player1.findCardByName('captive-audience');
            this.player1.player.moveCard(this.assassination, 'conflict deck');
            this.player1.player.moveCard(this.honoredBlade, 'conflict deck');
            this.player1.player.moveCard(this.masterOfTheSpear, 'conflict deck');
            this.player1.player.moveCard(this.readyForBattle, 'conflict deck');
        });

        it('should not be able to be triggered outside of a conflict', function () {
            this.player1.pass();
            this.player2.clickCard(this.swallowsReturn);
            expect(this.player2).toHavePrompt('Action Window');
        });

        describe('during a conflict', function () {
            beforeEach(function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
            });

            it('should prompt the player to choose a card to play', function () {
                this.player2.clickCard(this.swallowsReturn);
                expect(this.player2).toHavePrompt("A Swallow's Return");
                expect(this.player2).toHavePrompt('Choose a card to play');

                expect(this.player2).toHavePromptButton('Assassination');
                expect(this.player2).not.toHavePromptButton('Ready for Battle');
                expect(this.player2).toHavePromptButton('Honored Blade');
                expect(this.player2).toHavePromptButton('Master of the Spear');
                expect(this.player2).toHavePromptButton('Play nothing');
                expect(this.getChatLogs(3)).toContain(
                    "player2 plays A Swallow's Return, revealing Ready for Battle, Master of the Spear, Honored Blade and Assassination to choose one of those to play"
                );
            });

            it('should allow the player to play an event from the deck', function () {
                this.player2.clickCard(this.swallowsReturn);
                this.player2.clickPrompt('Assassination');
                expect(this.player2).toHavePrompt('Assassination');
                this.player2.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.player2.honor).toBe(7);
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.player1.player.conflictDiscardPile.toArray()).toContain(this.assassination);
                expect(this.getChatLogs(5)).toContain(
                    'player2 chooses to play Assassination and discard Ready for Battle, Master of the Spear and Honored Blade'
                );
                expect(this.getChatLogs(5)).toContain(
                    "player2 plays Assassination from their opponent's conflict deck"
                );

                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.honoredBlade.location).toBe('conflict discard pile');
                expect(this.masterOfTheSpear.location).toBe('conflict discard pile');
                expect(this.readyForBattle.location).toBe('conflict discard pile');
            });

            it('should allow the player to play an attachment from the deck', function () {
                this.player2.clickCard(this.swallowsReturn);

                this.player2.clickPrompt('Honored Blade');
                expect(this.player2).toHavePrompt('Honored Blade');

                this.player2.clickCard(this.matsuBerserker);
                expect(this.honoredBlade.location).toBe('play area');
                expect(this.honoredBlade.controller).toBe(this.player2.player);
                expect(this.matsuBerserker.attachments).toContain(this.honoredBlade);
                expect(this.player2.fate).toBe(3);
                expect(this.getChatLogs(5)).toContain(
                    'player2 chooses to play Honored Blade and discard Ready for Battle, Master of the Spear and Assassination'
                );
                expect(this.getChatLogs(5)).toContain('player2 plays Honored Blade, attaching it to Matsu Berserker');
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.masterOfTheSpear.location).toBe('conflict discard pile');
                expect(this.readyForBattle.location).toBe('conflict discard pile');
            });

            it('should allow the player to play a character from the deck', function () {
                this.player2.clickCard(this.swallowsReturn);

                this.player2.clickPrompt('Master of the Spear');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');

                expect(this.masterOfTheSpear.location).toBe('play area');
                expect(this.masterOfTheSpear.inConflict).toBe(true);
                expect(this.masterOfTheSpear.controller).toBe(this.player2.player);
                expect(this.player2.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain(
                    'player2 chooses to play Master of the Spear and discard Ready for Battle, Honored Blade and Assassination'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player2 plays Master of the Spear into the conflict with 0 additional fate'
                );
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.honoredBlade.location).toBe('conflict discard pile');
                expect(this.readyForBattle.location).toBe('conflict discard pile');
            });
        });
    });
});
