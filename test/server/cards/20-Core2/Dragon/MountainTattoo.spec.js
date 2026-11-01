describe('Mountain Tattoo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate'],
                    hand: ['mountain-tattoo']
                },
                player2: {
                    inPlay: ['togashi-initiate']
                }
            });
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.opponentsInitiate = this.player2.findCardByName('togashi-initiate');
        });

        it('attaches only to a Monk you control', function () {
            this.player1.clickCard('mountain-tattoo');
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.opponentsInitiate);
        });
    });
});

describe('Mountain Tattoo on a character', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'togashi-initiate', attachments: ['mountain-tattoo'] },
                        'doji-challenger',
                        { card: 'doji-whisperer', bowed: true }
                    ],
                    hand: ['banzai']
                },
                player2: {
                    inPlay: ['matsu-berserker'],
                    hand: ['banzai']
                }
            });
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.banzai = this.player1.findCardByName('banzai');
            this.opponentsBanzai = this.player2.findCardByName('banzai');
        });

        it('gives the Tattooed trait', function () {
            expect(this.initiate.hasTrait('tattooed')).toBe(true);
        });

        it('cannot be chosen as a target of opponents\' events', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.initiate, this.challenger],
                defenders: [this.berserker]
            });
            this.player2.clickCard(this.opponentsBanzai);
            expect(this.player2).not.toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.berserker);
        });

        it('can be chosen by its controller\'s events', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.initiate, this.challenger],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.banzai);
            expect(this.player1).toBeAbleToSelect(this.initiate);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.getMilitarySkill()).toBe(5);
        });

        it('cannot be readied outside the fate phase', function () {
            // the shared board starts it ready (it attacks in the other cases)
            this.initiate.bow();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.challenger],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Choose character to bow or unbow');
            expect(this.player1).not.toBeAbleToSelect(this.initiate);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(false);
            expect(this.initiate.bowed).toBe(true);
        });
    });
});

describe('Mountain Tattoo in the fate phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'fate',
                player1: {
                    inPlay: [{ card: 'togashi-initiate', fate: 2, bowed: true, attachments: ['mountain-tattoo'] }]
                }
            });
            this.initiate = this.player1.findCardByName('togashi-initiate');
        });

        it('lets the attached character ready in the fate phase', function () {
            expect(this.game.currentPhase).toBe('fate');
            expect(this.initiate.bowed).toBe(true);
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(false);
        });
    });
});
