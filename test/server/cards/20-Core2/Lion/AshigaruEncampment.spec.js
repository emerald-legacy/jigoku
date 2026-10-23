describe('Ashigaru Encampment', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['ashigaru-encampment']
                }
            });
            this.ashigaruEncampment = this.player1.placeCardInProvince('ashigaru-encampment');
            this.ashigaruEncampment.facedown = false;
        });

        it('puts an Ashigaru into play', function () {
            this.player1.clickCard(this.ashigaruEncampment);
            const ashigaru = this.player1.player.cardsInPlay[0];
            expect(ashigaru.name).toBe('Ashigaru Recruit');
            expect(ashigaru.militarySkill).toBe(1);
            expect(ashigaru.politicalSkill).toBe(0);
            expect(ashigaru.glory).toBe(1);
            expect(ashigaru.isFaction('lion')).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Ashigaru Encampment to recruit Ashigaru Recruit');
        });

        it('cannot be used with an empty dynasty deck', function () {
            this.player1.reduceDeckToNumber('dynasty deck', 0);
            this.player1.clickCard(this.ashigaruEncampment);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.player.cardsInPlay.length).toBe(0);
        });
    });
});

describe('Ashigaru Encampment while characters cannot enter play', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['expert-interpreter', 'doji-challenger']
                },
                player2: {
                    inPlay: ['matsu-berserker'],
                    dynastyDiscard: ['ashigaru-encampment']
                }
            });
            this.interpreter = this.player1.findCardByName('expert-interpreter');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.encampment = this.player2.placeCardInProvince('ashigaru-encampment', 'province 1');
            this.encampment.facedown = false;
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
            this.player1.clickCard(this.interpreter);
            this.player1.clickRing('air');
            this.player2.clickPrompt('No');
            this.noMoreActions();
            this.initiateConflict({
                ring: 'air',
                attackers: [this.challenger],
                defenders: []
            });
        });

        it('can\'t be used, and keeps the top card', function () {
            const deck = this.player2.player.dynastyDeck.length;
            this.player2.clickCard(this.encampment);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.player.dynastyDeck.length).toBe(deck);
        });
    });
});
