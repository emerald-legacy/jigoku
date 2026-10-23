describe('A Matsu Proves Their Worth', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'ikoma-prodigy'],
                    hand: ['a-matsu-proves-their-worth']
                },
                player2: {
                    inPlay: ['doji-kuwanan']
                }
            });

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.prodigy = this.player1.findCardByName('ikoma-prodigy');
            this.comingOfAge = this.player1.findCardByName('a-matsu-proves-their-worth');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.shameful = this.player2.findCardByName('shameful-display', 'province 1');

            this.noMoreActions();
        });

        it('discards the bushi on losses', function () {
            this.player1.clickRing('air');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Any reactions?');

            this.player1.clickCard(this.comingOfAge);

            this.player2.clickCard(this.kuwanan);
            this.player2.clickPrompt('Done');
            this.noMoreActions();

            expect(this.getChatLogs(5)).toContain(
                'Matsu Berserker is discarded from play due to failing at A Matsu Proves Their Worth'
            );
        });

        it('many gains when the bushi wins', function () {
            const initialHonor = this.player1.honor;
            this.player1.clickRing('water');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Any reactions?');

            this.player1.clickCard(this.comingOfAge);

            this.player2.clickPrompt('Done');
            this.noMoreActions();

            expect(this.berserker.fate).toBe(1);
            expect(this.berserker.isHonored).toBe(true);
            expect(this.player1.honor).toBe(initialHonor + 1);
            expect(this.player1.hand.length).toBe(1);

            expect(this.getChatLogs(5)).toContain(
                'Matsu Berserker is honored and receives 1 fate, and player1 gains 1 honor and draws 1 card due to Matsu Berserker succeeding at A Matsu Proves Their Worth'
            );
        });

        it('discards the bushi when it is at home at the end of the conflict', function () {
            this.player1.clickRing('water');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Initiate Conflict');
            this.player1.clickCard(this.comingOfAge);
            this.player2.clickPrompt('Done');

            this.game.currentConflict.removeFromConflict(this.berserker);
            this.noMoreActions();

            expect(this.berserker.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain(
                'Matsu Berserker is discarded from play due to failing at A Matsu Proves Their Worth'
            );
        });

        it('does nothing if the bushi is not alone ', function () {
            this.player1.clickRing('air');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.prodigy);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).not.toHavePrompt('Any reactions?');
        });

        it('does nothing for non-bushi', function () {
            this.player1.clickRing('air');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.prodigy);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).not.toHavePrompt('Any reactions?');
        });
    });
});

describe('A Matsu Proves Their Worth played by its owner\'s opponent', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['trading-on-the-sand-road']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    conflictDiscard: ['a-matsu-proves-their-worth']
                }
            });
            this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');
            this.comingOfAge = this.player2.findCardByName('a-matsu-proves-their-worth');
            this.player2.moveCard(this.comingOfAge, 'conflict deck');
            this.noMoreActions();
            this.player1.clickCard('trading-on-the-sand-road');
            this.noMoreActions();
        });

        it('gives the honor and the card to the player who played it', function () {
            this.initiateConflict({
                attackers: [this.raitsugu],
                type: 'military'
            });
            this.player1.clickCard(this.comingOfAge);
            this.player2.clickPrompt('Done');
            const honor1 = this.player1.honor;
            const honor2 = this.player2.honor;
            const hand2 = this.player2.hand.length;
            this.noMoreActions();

            expect(this.raitsugu.isHonored).toBe(true);
            expect(this.player1.honor).toBe(honor1 + 1);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player2.honor).toBe(honor2 - 1);
            expect(this.player2.hand.length).toBe(hand2);
            expect(this.getChatLogs(5)).toContain(
                'Mirumoto Raitsugu is honored and receives 1 fate, and player1 gains 1 honor and draws 1 card due to Mirumoto Raitsugu succeeding at A Matsu Proves Their Worth'
            );
        });
    });
});
