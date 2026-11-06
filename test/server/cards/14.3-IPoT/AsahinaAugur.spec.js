describe('Asahina Augur', function() {
    integration(function() {
        describe('Asahina Augur\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-augur'],
                        dynastyDiscard: ['doji-challenger', 'doji-whisperer', 'favorable-ground']
                    }
                });
                this.dojiChallenger = this.player1.placeCardInProvince('doji-challenger', 'province 1');
                this.dojiChallenger.facedown = true;
                this.dojiWhisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 2');
                this.dojiWhisperer.facedown = true;
                this.favorable = this.player1.findCardByName('favorable-ground');
                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.player1.moveCard(this.favorable, 'dynasty deck');
            });

            it('should allow facedown cards to be seen', function() {
                this.game.checkGameState(true);
                expect(this.dojiChallenger.hideWhenFacedown()).toBe(false);
            });

            it('should allow a card to be discarded', function() {
                this.player1.clickCard('asahina-augur');
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.getChatLogs(3)).toContain('player1 uses Asahina Augur to discard a facedown card in province 1');
            });

            it('should allow a facedown card to be seen after the discard', function() {
                this.game.checkGameState(true);
                this.player1.clickCard('asahina-augur');
                expect(this.favorable.hideWhenFacedown()).toBe(true);
                expect(this.dojiWhisperer.hideWhenFacedown()).toBe(false);
                expect(this.dojiChallenger.hideWhenFacedown()).toBe(false);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.hideWhenFacedown()).toBe(true);
                expect(this.favorable.location).toBe('province 1');
                expect(this.favorable.hideWhenFacedown()).toBe(false);
                expect(this.dojiWhisperer.hideWhenFacedown()).toBe(false);
            });
        });

        describe('Asahina Augur\'s limit and target restriction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-augur'],
                        dynastyDiscard: ['doji-challenger', 'doji-whisperer', 'kakita-yoshi', 'brash-samurai']
                    },
                    player2: {
                        dynastyDiscard: ['favorable-ground']
                    }
                });
                this.augur = this.player1.findCardByName('asahina-augur');
                this.dojiChallenger = this.player1.placeCardInProvince('doji-challenger', 'province 1');
                this.dojiWhisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 2');
                this.yoshi = this.player1.placeCardInProvince('kakita-yoshi', 'province 3');
                this.brash = this.player1.placeCardInProvince('brash-samurai', 'province 4');
                this.favorable = this.player2.placeCardInProvince('favorable-ground', 'province 1');
            });

            it('should not allow choosing a card in an opponent\'s province', function() {
                this.player1.clickCard(this.augur);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.favorable);
                this.player1.clickCard(this.favorable);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.favorable.location).toBe('province 1');
            });

            it('should not be usable a fourth time in the same round', function() {
                this.player1.clickCard(this.augur);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
                this.player2.pass();
                this.player1.clickCard(this.augur);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
                this.player2.pass();
                this.player1.clickCard(this.augur);
                this.player1.clickCard(this.yoshi);
                expect(this.yoshi.location).toBe('dynasty discard pile');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.augur);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1).not.toHavePrompt('Choose a card');
                expect(this.brash.location).toBe('province 4');
            });
        });
    });
});
