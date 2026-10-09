describe('Walking the Way', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    hand: ['walking-the-way'],
                    dynastyDiscard: ['iron-mine', 'akodo-gunso', 'favorable-ground', 'hida-guardian', 'kakita-toshimoko']
                }
            });
            this.walkingTheWay = this.player1.findCardByName('walking-the-way');
            this.toshimoko = this.player1.placeCardInProvince('kakita-toshimoko', 'province 1');
            // 4 cards: Iron Mine is below the 3 Walking the Way looks at
            this.player1.reduceDeckToNumber('dynasty deck', 0);
            this.ironMine = this.player1.moveCard('iron-mine', 'dynasty deck');
            this.gunso = this.player1.moveCard('akodo-gunso', 'dynasty deck');
            this.favorableGround = this.player1.moveCard('favorable-ground', 'dynasty deck');
            this.guardian = this.player1.moveCard('hida-guardian', 'dynasty deck');
        });

        it('should offer only the top 3 cards, without a way to take nothing', function() {
            this.player1.clickCard(this.walkingTheWay);

            expect(this.player1).toHavePrompt('Choose a card to place in a province');
            expect(this.player1).toHavePromptButton('Hida Guardian');
            expect(this.player1).toHavePromptButton('Favorable Ground');
            expect(this.player1).toHavePromptButton('Akodo Gunsō');
            expect(this.player1).not.toHavePromptButton('Iron Mine');
            expect(this.player1).not.toHavePromptButton('Take nothing');
        });

        it('should replace a card in a province with the chosen card, faceup, then shuffle', function() {
            this.player1.clickCard(this.walkingTheWay);
            this.player1.clickPrompt('Favorable Ground');

            expect(this.player1).toHavePrompt('Choose a card to replace with Favorable Ground');
            this.player1.clickCard(this.toshimoko);

            expect(this.toshimoko.location).toBe('dynasty discard pile');
            expect(this.favorableGround.location).toBe('province 1');
            expect(this.favorableGround.facedown).toBe(false);
            expect(this.gunso.location).toBe('dynasty deck');
            expect(this.guardian.location).toBe('dynasty deck');
            expect(this.ironMine.location).toBe('dynasty deck');
            expect(this.getChatLogs(3)).toContain('player1 discards Kakita Toshimoko, replacing it with Favorable Ground');
            expect(this.getChatLogs(3)).toContain('player1 is shuffling their dynasty deck');
        });
    });
});
