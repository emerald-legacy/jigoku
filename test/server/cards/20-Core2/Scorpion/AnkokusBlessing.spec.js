describe('Ankoku\'s Blessing', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'fate',
                player1: {
                    hand: ['ankoku-s-blessing', 'let-go', 'fine-katana']
                },
                player2: {
                    inPlay: ['fushicho']
                }
            });
            this.blessing = this.player1.findCardByName('ankoku-s-blessing');
            this.letGo = this.player1.findCardByName('let-go');
            this.katana = this.player1.findCardByName('fine-katana');
        });

        it('should discard a card from hand to gain 2 fate and draw 2 cards', function () {
            const fate = this.player1.fate;
            const hand = this.player1.hand.length;

            this.player1.clickCard(this.blessing);
            expect(this.player1).toHavePrompt('Select card to discard');
            expect(this.player1).toBeAbleToSelect(this.letGo);
            expect(this.player1).toBeAbleToSelect(this.katana);

            this.player1.clickCard(this.letGo);

            expect(this.player1.fate).toBe(fate + 1);
            expect(this.player1.hand.length).toBe(hand);
            expect(this.letGo.location).toBe('conflict discard pile');

            expect(this.getChatLogs(5)).toContain(
                'player1 plays Ankoku\'s Blessing, discarding Let Go to draw 2 cards and gain 2 fate'
            );
        });
    });
});

describe('Ankoku\'s Blessing with two copies', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'fate',
                player1: {
                    fate: 5,
                    hand: ['ankoku-s-blessing', 'ankoku-s-blessing', 'let-go']
                },
                player2: {
                    inPlay: ['fushicho']
                }
            });
            this.blessings = this.player1.filterCardsByName('ankoku-s-blessing', 'hand');
            this.letGo = this.player1.findCardByName('let-go');
        });

        it('cannot discard a Blessing card for the cost', function () {
            this.player1.clickCard(this.blessings[0]);
            expect(this.player1).toHavePrompt('Select card to discard');
            expect(this.player1).toBeAbleToSelect(this.letGo);
            expect(this.player1).not.toBeAbleToSelect(this.blessings[1]);
        });

        it('cannot be played a second time in the same round', function () {
            this.player1.clickCard(this.blessings[0]);
            this.player1.clickCard(this.letGo);
            expect(this.player1.fate).toBe(6);
            this.player2.pass();

            this.player1.clickCard(this.blessings[1]);
            expect(this.player1).not.toHavePrompt('Select card to discard');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.blessings[1].location).toBe('hand');
            expect(this.player1.fate).toBe(6);
        });
    });
});

describe('Ankoku\'s Blessing outside the fate phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    hand: ['ankoku-s-blessing', 'let-go']
                }
            });
            this.blessing = this.player1.findCardByName('ankoku-s-blessing');
            this.letGo = this.player1.findCardByName('let-go');
        });

        it('cannot be played', function () {
            this.player1.clickCard(this.blessing);
            expect(this.player1).not.toHavePrompt('Select card to discard');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.blessing.location).toBe('hand');
            expect(this.letGo.location).toBe('hand');
            expect(this.player1.fate).toBe(5);
        });
    });
});
