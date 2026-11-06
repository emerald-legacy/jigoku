describe('Tutored', function () {
    integration(function () {
        function playYoshi(test) {
            test.yoshi = test.player1.placeCardInProvince('yasuki-yoshi', 'province 1');
            test.player1.clickCard(test.yoshi);
            test.player1.clickPrompt('0');
        }

        describe('with copies in the discard pile and the hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['yasuki-yoshi'],
                        conflictDiscard: ['writ-of-survey'],
                        hand: ['writ-of-survey']
                    }
                });
                this.discarded = this.player1.findCardByName('writ-of-survey', 'conflict discard pile');
                this.inHand = this.player1.findCardByName('writ-of-survey', 'hand');
                playYoshi(this);
            });

            it('searches the discard pile first', function () {
                expect(this.player1).toHavePrompt('Choose a Writ of Survey');
                this.player1.clickPrompt('Writ of Survey');
                expect(this.yoshi.attachments).toContain(this.discarded);
                expect(this.inHand.location).toBe('hand');
                expect(this.getChatLogs(3)).toContain('Yasuki Yoshi receives their Writ of Survey');
            });

            it('moves on to the next area when the player takes nothing', function () {
                this.player1.clickPrompt('Take nothing');
                expect(this.player1).toHavePrompt('Choose a Writ of Survey');
                this.player1.clickPrompt('Writ of Survey');
                expect(this.yoshi.attachments).toContain(this.inHand);
                expect(this.discarded.location).toBe('conflict discard pile');
            });
        });

        describe('with a copy in the conflict deck', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['yasuki-yoshi'],
                        conflictDeck: ['writ-of-survey']
                    }
                });
                this.inDeck = this.player1.findCardByName('writ-of-survey', 'conflict deck');
                playYoshi(this);
            });

            it('finds it and shuffles the deck', function () {
                this.player1.clickPrompt('Writ of Survey');
                expect(this.yoshi.attachments).toContain(this.inDeck);
                expect(this.getChatLogs(3)).toContain('player1 is shuffling their conflict deck');
            });
        });

        describe('without a copy', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['yasuki-yoshi']
                    }
                });
                playYoshi(this);
            });

            it('does nothing', function () {
                expect(this.player1).not.toHavePrompt('Choose a Writ of Survey');
                expect(this.yoshi.location).toBe('play area');
                expect(this.yoshi.attachments.length).toBe(0);
            });
        });
    });
});
