describe('Yasuki Fuzake', function() {
    integration(function() {
        describe('Yasuki Fuzake\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yasuki-fuzake','eager-scout'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['asahina-storyteller', 'doji-challenger', 'callow-delegate'],
                        hand: ['noble-sacrifice']
                    }
                });
                this.yasukiFuzake = this.player1.findCardByName('yasuki-fuzake');
                this.eagerScout = this.player1.findCardByName('eager-scout');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.asahinaStoryteller = this.player2.findCardByName('asahina-storyteller');
                this.dojiChallenger.honor();
                this.eagerScout.honor();
                this.asahinaStoryteller.honor();
                this.asahinaStoryteller.taint();
                this.yasukiFuzake.dishonor();
                this.player1.pass();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickCard(this.yasukiFuzake);
                this.player2.clickCard(this.dojiChallenger);
            });

            it('should trigger when leaving play', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yasukiFuzake);
            });

            it('should prompt to choose up to 1 character controlled by each player', function() {
                this.player1.clickCard(this.yasukiFuzake);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.eagerScout);
                expect(this.player1).toBeAbleToSelect(this.yasukiFuzake);
                expect(this.player1).toBeAbleToSelect(this.asahinaStoryteller);
                expect(this.player1).not.toBeAbleToSelect(this.callowDelegate);
            });

            it('should allow the player to select only 1 character', function() {
                this.player1.clickCard(this.yasukiFuzake);
                this.player1.clickCard(this.eagerScout);
                this.player1.clickPrompt('Done');
                expect(this.eagerScout.isHonored).toBe(false);
                expect(this.yasukiFuzake.location).toBe('dynasty discard pile');
            });

            it('should not let the player skip the first choice', function() {
                this.player1.clickCard(this.yasukiFuzake);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.asahinaStoryteller);
                expect(this.player1).not.toHavePromptButton('Done');
            });

            it('should name only the chosen character when the second is skipped', function() {
                this.player1.clickCard(this.yasukiFuzake);
                this.player1.clickCard(this.asahinaStoryteller);
                this.player1.clickPrompt('Done');
                expect(this.asahinaStoryteller.isHonored).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 uses Yasuki Fuzake to discard all status tokens from Asahina Storyteller');
            });

            it('should not allow the player to select 2 characters controlled by the same player', function() {
                this.player1.clickCard(this.yasukiFuzake);
                this.player1.clickCard(this.eagerScout);
                expect(this.player1).not.toBeAbleToSelect(this.yasukiFuzake);
                expect(this.player1).toBeAbleToSelect(this.asahinaStoryteller);
            });

            it('should be able to select himself', function() {
                this.player1.clickCard(this.yasukiFuzake);
                this.player1.clickCard(this.yasukiFuzake);
                this.player1.clickPrompt('Done');
                expect(this.player1.honor).toBe(10);
                expect(this.yasukiFuzake.location).toBe('dynasty discard pile');
            });

            it('should remove the status tokens of chosen characters', function() {
                expect(this.eagerScout.isHonored).toBe(true);
                expect(this.asahinaStoryteller.isHonored).toBe(true);
                expect(this.asahinaStoryteller.isTainted).toBe(true);
                this.player1.clickCard(this.yasukiFuzake);
                this.player1.clickCard(this.eagerScout);
                this.player1.clickCard(this.asahinaStoryteller);
                expect(this.eagerScout.isHonored).toBe(false);
                expect(this.asahinaStoryteller.isHonored).toBe(false);
                expect(this.asahinaStoryteller.isTainted).toBe(false);
                expect(this.yasukiFuzake.location).toBe('dynasty discard pile');
            });
        });
    });
});

describe('Yasuki Fuzake with no status token in play', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['yasuki-fuzake'],
                    hand: ['way-of-the-crab']
                },
                player2: {
                    inPlay: ['moto-chagatai']
                }
            });
            this.fuzake = this.player1.findCardByName('yasuki-fuzake');
            this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');
        });

        it('should not trigger, as there is no status token to discard', function() {
            this.player1.clickCard(this.wayOfTheCrab);
            this.player1.clickCard(this.fuzake);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.fuzake.location).toBe('dynasty discard pile');
            expect(this.player2).toHavePrompt('Choose a character to sacrifice');
        });
    });
});
