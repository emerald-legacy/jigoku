describe('Lucky Coin', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: {
                    inPlay: [{ card: 'doji-kuwanan', fate: 1 }],
                    conflictDiscard: ['lucky-coin'],
                    dynastyDiscard: [
                        'iron-mine',
                        'miya-mystic',
                        'miya-mystic',
                        'aranat',
                        'fushicho',
                        'imperial-storehouse',
                        'miya-library',
                        'doji-kuwanan',
                        'doji-kuwanan'
                    ],
                    provinces: {
                        'province 1': { dynastyCards: ['adept-of-the-waves'] },
                        'province 2': { dynastyCards: ['adept-of-the-waves'] },
                        'province 3': { dynastyCards: ['adept-of-the-waves'] },
                        'province 4': { dynastyCards: ['adept-of-the-waves'] }
                    }
                },
                player2: {
                    provinces: {
                        'province 1': { dynastyCards: ['adept-of-the-waves'] },
                        'province 2': { dynastyCards: ['adept-of-the-waves'] },
                        'province 3': { dynastyCards: ['adept-of-the-waves'] },
                        'province 4': { dynastyCards: ['adept-of-the-waves'] }
                    }
                }
            });

            this.flow.keepDynasty();
            this.flow.keepConflict();
            this.player1.player.promptedActionWindows.fate = true;
            this.player2.player.promptedActionWindows.fate = true;
            this.flow.advancePhases('fate');

            this.kuwanan = this.player1.findCardByName('doji-kuwanan', 'play area');
            this.coin = this.player1.findCardByName('lucky-coin');

            this.mine = this.player1.findCardByName('iron-mine');
            this.mystics = this.player1.findAllCardsByName('miya-mystic');
            this.mystic = this.mystics[0];
            this.aranat = this.player1.findCardByName('aranat');
            this.fushicho = this.player1.findCardByName('fushicho');
            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.library = this.player1.findCardByName('miya-library');
            this.kuwanansInDiscard = this.player1.findAllCardsByName('doji-kuwanan', 'dynasty discard pile');
        });

        describe('for flips with ok cost', function () {
            beforeEach(function () {
                this.player1.placeCardInProvince(this.mine, 'province 1');
                this.mine.facedown = true;
                this.player1.placeCardInProvince(this.library, 'province 2');
                this.library.facedown = true;
                this.player1.placeCardInProvince(this.fushicho, 'province 3');
                this.fushicho.facedown = true;
                this.player1.placeCardInProvince(this.mystic, 'province 4');
                this.mystic.facedown = true;
                this.player1.moveCard(this.coin, 'hand');
            });

            describe('with attachment in play', function () {
                beforeEach(function () {
                    this.player1.playAttachment(this.coin, this.kuwanan);

                    this.noMoreActions();
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('End Round');
                    this.player1.clickPrompt('End Round');
                });

                it('nothing happens', function () {
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                });
            });

            describe('with attachment in hand', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('End Round');
                    this.player1.clickPrompt('End Round');
                });

                it('nothing happens', function () {
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                });
            });
        });

        describe('for too expensive flips', function () {
            beforeEach(function () {
                this.player1.placeCardInProvince(this.kuwanansInDiscard[0], 'province 1');
                this.kuwanansInDiscard[0].facedown = true;
                this.player1.placeCardInProvince(this.kuwanansInDiscard[1], 'province 2');
                this.kuwanansInDiscard[1].facedown = true;
                this.player1.placeCardInProvince(this.mystics[0], 'province 3');
                this.mystics[0].facedown = true;
                this.player1.placeCardInProvince(this.mystics[1], 'province 4');
                this.mystics[1].facedown = true;
                this.player1.moveCard(this.coin, 'hand');
            });

            describe('with attachment in play', function () {
                beforeEach(function () {
                    this.player1.playAttachment(this.coin, this.kuwanan);

                    this.noMoreActions();
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('End Round');
                    this.player1.clickPrompt('End Round');
                });

                it('mulligan everything', function () {
                    expect(this.player1).toHavePrompt('Triggered Abilities');

                    this.player1.clickCard(this.coin);
                    expect(this.getChatLogs(3)).toContain(
                        'player1 uses Lucky Coin, removing Lucky Coin from the game to to replace all cards in their provinces'
                    );
                });

                it('refills provinces face-up', function () {
                    this.player1.clickCard(this.coin);
                    for(const loc of ['province 1', 'province 2', 'province 3', 'province 4']) {
                        const card = this.player1.player.getDynastyCardInProvince(loc);
                        expect(card).not.toBeNull();
                        expect(card.facedown).toBe(false);
                    }
                });
            });

            describe('with attachment in hand', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('End Round');
                    this.player1.clickPrompt('End Round');
                });

                it('mulligan everything', function () {
                    expect(this.player1).toHavePrompt('Triggered Abilities');

                    this.player1.clickCard(this.coin);
                    expect(this.getChatLogs(3)).toContain(
                        'player1 uses Lucky Coin, removing Lucky Coin from the game to to replace all cards in their provinces'
                    );
                });

                it('refills provinces face-up', function () {
                    this.player1.clickCard(this.coin);
                    for(const loc of ['province 1', 'province 2', 'province 3', 'province 4']) {
                        const card = this.player1.player.getDynastyCardInProvince(loc);
                        expect(card).not.toBeNull();
                        expect(card.facedown).toBe(false);
                    }
                });
            });
        });

        describe('for too cheap flips', function () {
            beforeEach(function () {
                this.player1.placeCardInProvince(this.mine, 'province 1');
                this.mine.facedown = true;
                this.player1.placeCardInProvince(this.library, 'province 2');
                this.library.facedown = true;
                this.player1.placeCardInProvince(this.storehouse, 'province 3');
                this.storehouse.facedown = true;
                this.player1.placeCardInProvince(this.mystic, 'province 4');
                this.mystic.facedown = true;
                this.player1.moveCard(this.coin, 'hand');
            });

            describe('with attachment in play', function () {
                beforeEach(function () {
                    this.player1.playAttachment(this.coin, this.kuwanan);

                    this.noMoreActions();
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('End Round');
                    this.player1.clickPrompt('End Round');
                });

                it('mulligan everything', function () {
                    expect(this.player1).toHavePrompt('Triggered Abilities');

                    this.player1.clickCard(this.coin);
                    expect(this.getChatLogs(3)).toContain(
                        'player1 uses Lucky Coin, removing Lucky Coin from the game to to replace all cards in their provinces'
                    );
                });
            });

            describe('with attachment in hand', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('End Round');
                    this.player1.clickPrompt('End Round');
                });

                it('mulligan everything', function () {
                    expect(this.player1).toHavePrompt('Triggered Abilities');

                    this.player1.clickCard(this.coin);
                    expect(this.getChatLogs(3)).toContain(
                        'player1 uses Lucky Coin, removing Lucky Coin from the game to to replace all cards in their provinces'
                    );
                });
            });
        });
    });
});
