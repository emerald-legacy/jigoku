describe('To Show the Path', function () {
    integration(function () {
        describe('it when you do not control a monk or shugenja', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-prodigy'],
                        hand: ['to-show-the-path']
                    }
                });

                this.prodigy = this.player1.findCardByName('ikoma-prodigy');

                this.toShowThePath = this.player1.findCardByName('to-show-the-path');
            });

            it('should not trigger', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('when there is no non-monk or non-shugenja to target', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doomed-shugenja'],
                        hand: ['to-show-the-path']
                    }
                });

                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');

                this.toShowThePath = this.player1.findCardByName('to-show-the-path');
            });

            it('it should not trigger', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('when you control a monk or shugenja and there is a valid target', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doomed-shugenja', 'togashi-mitsu', 'ikoma-prodigy', 'moto-youth'],
                        hand: ['to-show-the-path', 'a-perfect-cut', 'a-new-name', 'duelist-training']
                    },
                    player2: {
                        inPlay: ['togashi-ichi', 'isawa-kaede', 'matsu-berserker'],
                        hand: ['a-perfect-cut', 'let-go', 'let-go']
                    }
                });

                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.togashiMitsu = this.player1.findCardByName('togashi-mitsu');
                this.prodigy = this.player1.findCardByName('ikoma-prodigy');
                this.motoYouth = this.player1.findCardByName('moto-youth');

                this.togashiIchi = this.player2.findCardByName('togashi-ichi');
                this.isawaKaede = this.player2.findCardByName('isawa-kaede');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');

                this.toShowThePath = this.player1.findCardByName('to-show-the-path');
                this.aPerfectCut1 = this.player1.findCardByName('a-perfect-cut');

                this.aPerfectCut2 = this.player2.findCardByName('a-perfect-cut');

                this.letgo = this.player2.filterCardsByName('let-go')[0];
                this.letgo2 = this.player2.filterCardsByName('let-go')[1];

                this.ann = this.player1.findCardByName('a-new-name');
                this.duelist = this.player1.findCardByName('duelist-training');
            });

            it('it should allow to target a non-monk, non-shugenja owned by either player', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Choose a character');

                expect(this.player1).toBeAbleToSelect(this.prodigy);
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player1).not.toBeAbleToSelect(this.togashiIchi);
                expect(this.player1).not.toBeAbleToSelect(this.isawaKaede);
                expect(this.player1).not.toBeAbleToSelect(this.togashiMitsu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);

                this.player1.clickCard(this.prodigy);
                expect(this.getChatLogs(3)).toContain(
                    'player1 plays To Show the Path to make player2 pay 1 additional fate as a cost whenever they target Ikoma Prodigy or its attachments with a card ability until the end of the phase'
                );
            });

            it('taxes targets on character', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Choose a character');

                this.player1.clickCard(this.motoYouth);

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prodigy, this.motoYouth],
                    defenders: [],
                    type: 'military'
                });

                const player1InitialFate = this.player1.fate;
                const player2InitialFate = this.player2.fate;

                this.player2.clickCard(this.aPerfectCut2);
                this.player2.clickCard(this.motoYouth);

                this.player1.clickCard(this.aPerfectCut1);
                this.player1.clickCard(this.motoYouth);

                expect(this.player1.fate).toBe(player1InitialFate); // no cost increase for the player of To Show the Path
                expect(this.player2.fate).toBe(player2InitialFate - 1); // cost increase for the opponent
            });

            it('taxes attachments that are on the character when the event is played', function () {
                this.player1.playAttachment(this.duelist, this.motoYouth);
                this.player2.pass();
                this.player1.clickCard(this.toShowThePath);
                this.player1.clickCard(this.motoYouth);
                expect(this.getChatLogs(3)).toContain(
                    'player1 plays To Show the Path to make player2 pay 1 additional fate as a cost whenever they target Moto Youth or its attachments with a card ability until the end of the phase'
                );

                this.player2.pass();
                this.player1.playAttachment(this.ann, this.motoYouth);

                const fate = this.player2.fate;
                this.player2.clickCard(this.letgo);
                this.player2.clickCard(this.duelist);
                expect(this.player2.fate).toBe(fate - 1); // cost increase for the opponent
                expect(this.duelist.location).toBe('conflict discard pile');
            });

            it('taxes attachments played on the character after Show the Path', function () {
                this.player1.playAttachment(this.duelist, this.motoYouth);

                this.player2.pass();
                this.player1.clickCard(this.toShowThePath);
                this.player1.clickCard(this.motoYouth);

                this.player2.pass();
                expect(this.ann.location).toBe('hand');
                this.player1.playAttachment(this.ann, this.motoYouth);
                expect(this.ann.location).toBe('play area');

                const fate = this.player2.fate;
                this.player2.clickCard(this.letgo);
                this.player2.clickCard(this.duelist);
                expect(this.player2.fate).toBe(fate - 1); // cost increase for the opponent
                expect(this.duelist.location).toBe('conflict discard pile');

                this.player1.pass();
                this.player2.clickCard(this.letgo2);
                this.player2.clickCard(this.ann);
                expect(this.player2.fate).toBe(fate - 2); // cost increase for the opponent
                expect(this.ann.location).toBe('conflict discard pile');
            });
        });
    });
});

describe('To Show the Path and an ability that also costs fate', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja', 'doji-whisperer'],
                    hand: ['to-show-the-path']
                },
                player2: {
                    fate: 1,
                    inPlay: ['soshi-illusionist', 'kakita-yoshi']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.illusionist = this.player2.findCardByName('soshi-illusionist');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.whisperer.honor();
            this.yoshi.honor();
            this.player1.clickCard('to-show-the-path');
            this.player1.clickCard(this.whisperer);
        });

        it('doesn\'t offer its character when the ability\'s own fate cost leaves no fate for it', function () {
            expect(this.player2.fate).toBe(1);
            this.player2.clickCard(this.illusionist);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
        });
    });
});

describe('To Show the Path and a resolved ability', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja', 'doji-challenger'],
                    hand: ['to-show-the-path']
                },
                player2: {
                    fate: 10,
                    inPlay: ['doji-kuwanan'],
                    hand: ['battlefield-orders']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.orders = this.player2.findCardByName('battlefield-orders');
            this.player1.clickCard('to-show-the-path');
            this.player1.clickCard(this.challenger);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.kuwanan]
            });
        });

        it('makes the opponent pay the extra fate when an ability resolved by Battlefield Orders chooses that character', function () {
            const fate = this.player2.fate;
            this.player2.clickCard(this.orders);
            this.player2.clickCard(this.kuwanan);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.bowed).toBe(true);
            expect(this.player2.fate).toBe(fate - this.orders.printedCost - 1);
        });
    });
});

describe('To Show the Path played by its owner\'s opponent', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['doomed-shugenja', 'doji-challenger'],
                    hand: ['trading-on-the-sand-road']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    conflictDiscard: ['to-show-the-path']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toShowThePath = this.player2.findCardByName('to-show-the-path');
            this.player2.moveCard(this.toShowThePath, 'conflict deck');
            this.noMoreActions();
            this.player1.clickCard('trading-on-the-sand-road');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
        });

        it('names the opponent of the player who played it', function () {
            this.player1.clickCard(this.toShowThePath);
            this.player1.clickCard(this.challenger);
            expect(this.getChatLogs(3)).toContain(
                'player1 plays To Show the Path to make player2 pay 1 additional fate as a cost whenever they target Doji Challenger or its attachments with a card ability until the end of the phase'
            );
        });
    });
});
