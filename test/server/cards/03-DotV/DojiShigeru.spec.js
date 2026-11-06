describe('Doji Shigeru', function() {
    integration(function() {
        describe('Doji Shigeru\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-shigeru'],
                        hand: ['banzai']
                    },
                    player2: {
                        inPlay: ['kaiu-envoy'],
                        hand: ['fine-katana','kami-unleashed','banzai','court-games']
                    }
                });
                this.dojiShigeru = this.player1.findCardByName('doji-shigeru');
                this.ownBanzai = this.player1.findCardByName('banzai');

                this.kaiuEnvoy = this.player2.findCardByName('kaiu-envoy');

                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed');
                this.banzai = this.player2.findCardByName('banzai');
                this.courtGames = this.player2.findCardByName('court-games');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiShigeru],
                    defenders: [this.kaiuEnvoy],
                    type: 'political'
                });
            });

            it('should trigger when the opponent plays an event', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.kaiuEnvoy);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
            });

            it('should not trigger when the opponent plays an attachment', function() {
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.kaiuEnvoy);
                expect(this.fineKatana.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when the opponent plays a conflict character', function() {
                this.player2.clickCard(this.kamiUnleashed);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Home');
                expect(this.kamiUnleashed.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when you play an event yourself', function() {
                this.player2.pass();
                this.player1.clickCard(this.ownBanzai);
                this.player1.clickCard(this.kaiuEnvoy);
                this.player1.clickPrompt('Done');
                expect(this.ownBanzai.location).toBe('conflict discard pile');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player2.hand.length).toBe(4);
            });

            describe('if triggered', function() {
                beforeEach(function() {
                    this.player2.clickCard(this.banzai);
                    this.player2.clickCard(this.kaiuEnvoy);
                    this.player2.clickPrompt('Done');
                    this.player1.clickCard(this.dojiShigeru);
                });

                it('should prompt to choose a card from hand', function() {
                    expect(this.player2).toHavePrompt('Choose a card to discard');
                    expect(this.player2).toBeAbleToSelect(this.fineKatana);
                    expect(this.player2).toBeAbleToSelect(this.kamiUnleashed);
                    expect(this.player2).toBeAbleToSelect(this.courtGames);
                });

                it('should discard the chosen card', function() {
                    this.player2.clickCard(this.fineKatana);
                    expect(this.fineKatana.location).toBe('conflict discard pile');
                });

                // ruling #499: once per event played
                it('should not trigger a second time for the same event', function() {
                    this.player2.clickCard(this.fineKatana);
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    expect(this.player2.hand.length).toBe(2);
                });

                it('should be able to be triggered again', function() {
                    this.player2.clickCard(this.fineKatana);
                    this.player1.pass();
                    this.player2.clickCard(this.courtGames);
                    this.player2.clickPrompt('Honor a friendly character');
                    this.player2.clickCard(this.kaiuEnvoy);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
                });
            });
        });
    });
});

describe('Doji Shigeru at home', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shigeru', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['kaiu-envoy'],
                    hand: ['banzai', 'fine-katana']
                }
            });
            this.dojiShigeru = this.player1.findCardByName('doji-shigeru');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.kaiuEnvoy = this.player2.findCardByName('kaiu-envoy');
            this.banzai = this.player2.findCardByName('banzai');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.kaiuEnvoy],
                type: 'political'
            });
        });

        it('should not trigger when the opponent plays an event during a conflict it isn\'t participating in', function() {
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.kaiuEnvoy);
            this.player2.clickPrompt('Done');
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player2.hand.length).toBe(1);
        });
    });
});
