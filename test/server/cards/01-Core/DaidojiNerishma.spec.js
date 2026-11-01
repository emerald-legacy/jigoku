describe('Daidoji Nerishma', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    inPlay: ['daidoji-nerishma'],
                    dynastyDiscard: ['doji-whisperer', 'kakita-yoshi']
                },
                player2: {
                    fate: 5,
                    dynastyDiscard: ['doji-whisperer']
                }
            });
            this.nerishma = this.player1.findCardByName('daidoji-nerishma');
            this.player1.placeCardInProvince('doji-whisperer', 'province 1');
            this.faceupCard = this.player1.placeCardInProvince('kakita-yoshi', 'province 2');
            this.player2.placeCardInProvince('doji-whisperer', 'province 1');
            this.player1.playFromProvinces('doji-whisperer');
            this.player2.playFromProvinces('doji-whisperer');
            this.facedownCard = this.player1.player.getDynastyCardInProvince('province 1');
            this.opponentFacedownCard = this.player2.player.getDynastyCardInProvince('province 1');
        });

        it('turns a facedown card in one of your provinces faceup', function() {
            expect(this.facedownCard.facedown).toBe(true);
            this.player1.clickCard(this.nerishma);
            expect(this.player1).toBeAbleToSelect(this.facedownCard);
            this.player1.clickCard(this.facedownCard);
            expect(this.facedownCard.facedown).toBe(false);
            expect(this.facedownCard.location).toBe('province 1');
        });

        it('cannot choose a faceup card or a card in an opponent\'s province', function() {
            expect(this.opponentFacedownCard.facedown).toBe(true);
            this.player1.clickCard(this.nerishma);
            expect(this.player1).toBeAbleToSelect(this.facedownCard);
            expect(this.player1).not.toBeAbleToSelect(this.faceupCard);
            expect(this.player1).not.toBeAbleToSelect(this.opponentFacedownCard);
        });
    });
});
