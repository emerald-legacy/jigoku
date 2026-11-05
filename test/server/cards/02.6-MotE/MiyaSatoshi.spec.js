describe('Miya Satoshi', function() {
    integration(function() {
        describe('With a card in the stronghold province', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-satoshi'],
                        dynastyDeck: ['kanjo-district', 'shiba-tsukune']
                    }
                });
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.player1.player.moveCard(this.shibaTsukune, 'stronghold province');
                this.shibaTsukune.facedown = false;
                this.kanjoDistrict = this.player1.findCardByName('kanjo-district');
                if(this.kanjoDistrict.location !== 'dynasty deck') {
                    this.player1.player.moveCard(this.kanjoDistrict, 'dynasty deck');
                }
                this.player1.clickCard('miya-satoshi');
            });

            it('should not allow the player to choose it: only non-stronghold provinces', function() {
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).not.toBeAbleToSelect(this.shibaTsukune);
            });
        });

        describe('When using his ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-satoshi'],
                        dynastyDeck: ['kanjo-district', 'shiba-tsukune']
                    }
                });
                this.shibaTsukune = this.player1.placeCardInProvince('shiba-tsukune', 'province 1');
                this.kanjoDistrict = this.player1.findCardByName('kanjo-district');
                if(this.kanjoDistrict.location !== 'dynasty deck') {
                    this.player1.player.moveCard(this.kanjoDistrict, 'dynasty deck');
                }
                this.miyaSatoshi = this.player1.clickCard('miya-satoshi');
            });

            it('should discard cards until Kanjo District is the last card discarded', function() {
                expect(this.player1.player.dynastyDiscardPile[0]).toBe(this.kanjoDistrict);
            });

            it('should prompt the player to choose where to put Kanjo District', function() {
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            it('should allow the player to choose a facedown card', function() {
                this.shibaTsukune.facedown = true;
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            describe('When the player chooses a card', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shibaTsukune);
                });

                it('should discard that card', function() {
                    expect(this.shibaTsukune.location).toBe('dynasty discard pile');
                });

                it('should place Kanjo District faceup in its place', function() {
                    expect(this.kanjoDistrict.location).toBe('province 1');
                    expect(this.kanjoDistrict.facedown).toBe(false);
                });
            });
        });
    });
});

describe('Miya Satoshi without an Imperial card in the dynasty deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    honor: 10,
                    inPlay: ['miya-satoshi']
                }
            });
            this.player1.reduceDeckToNumber('dynasty deck', 3);
            this.deck = this.player1.player.dynastyDeck.slice();
        });

        // ruling #315: the rest of the effect fizzles; no honor loss and no reshuffle
        it('discards the whole dynasty deck and does nothing else', function() {
            this.player1.clickCard('miya-satoshi');
            expect(this.player1).not.toHavePrompt('Choose a card to discard');
            expect(this.player1.player.dynastyDeck.length).toBe(0);
            this.deck.forEach((card) => expect(card.location).toBe('dynasty discard pile'));
            expect(this.player1.honor).toBe(10);
            expect(this.getChatLogs(3)).toContain('player1 discards their entire dynasty deck: Adept of the Waves, Adept of the Waves and Adept of the Waves');
        });
    });
});
