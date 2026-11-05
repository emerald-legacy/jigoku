describe('Callow Delegate', function() {
    integration(function() {
        describe('Callow Delegate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 9,
                        inPlay: ['bayushi-shoju'],
                        hand: ['assassination']
                    },
                    player2: {
                        honor: 9,
                        inPlay: ['callow-delegate', 'doji-challenger']
                    }
                });
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.assassination = this.player1.findCardByName('assassination');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.bayushiShoju],
                    defenders: [this.callowDelegate]
                });
                this.player2.pass();
            });

            it('should prompt to honor a character when leaving play', function() {
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Callow Delegate');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player2).not.toBeAbleToSelect(this.bayushiShoju);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.callowDelegate.location).toBe('dynasty discard pile');
                expect(this.dojiChallenger.isHonored).toBe(true);
            });

            it('should increase player honor if callow delegate is the target of the interupt', function() {
                const player2HonorBefore = this.player2.honor;
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Callow Delegate');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.callowDelegate.location).toBe('dynasty discard pile');
                expect(this.player2.honor).toBe(player2HonorBefore + 1);
            });
        });
    });
});

describe('Callow Delegate rulings', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 9,
                    fate: 5,
                    inPlay: ['bayushi-shoju', 'isawa-kaede'],
                    hand: ['assassination', 'cloud-the-mind']
                },
                player2: {
                    honor: 9,
                    inPlay: ['callow-delegate', 'asahina-storyteller']
                }
            });
            this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
            this.assassination = this.player1.findCardByName('assassination');
            this.callowDelegate = this.player2.findCardByName('callow-delegate');
            this.storyteller = this.player2.findCardByName('asahina-storyteller');
        });

        it('draws for Sincerity after honoring itself with Asahina Storyteller in play (#444)', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.bayushiShoju],
                defenders: [this.callowDelegate]
            });
            this.player2.pass();
            const hand = this.player2.hand.length;
            const honor = this.player2.honor;
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.callowDelegate);
            this.player2.clickCard(this.callowDelegate);
            this.player2.clickCard(this.callowDelegate);
            expect(this.callowDelegate.location).toBe('dynasty discard pile');
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.player2.hand.length).toBe(hand + 1);
        });

        it('cannot honor a character with Cloud the Mind attached (#569)', function() {
            this.player1.playAttachment('cloud-the-mind', this.callowDelegate);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.bayushiShoju],
                defenders: [this.callowDelegate]
            });
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.callowDelegate);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.callowDelegate.location).toBe('dynasty discard pile');
            expect(this.storyteller.isHonored).toBe(false);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
