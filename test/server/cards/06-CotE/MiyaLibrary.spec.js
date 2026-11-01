describe('Miya Library', function () {
    integration(function () {
        describe('Miya Library\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-library', 'kanjo-district', 'miya-satoshi', 'adept-of-the-waves', 'kudaka', 'naive-student', 'seppun-guardsman'],
                        dynastyDeck: []
                    },
                    player2: {
                    }
                });
                this.miyaLibrary = this.player1.findCardByName('miya-library');
                this.miyaSatoshi = this.player1.findCardByName('miya-satoshi');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.kudaka = this.player1.findCardByName('kudaka');
                this.kanjo = this.player1.findCardByName('kanjo-district');
                this.naiveStudent = this.player1.findCardByName('naive-student');
                this.player1.placeCardInProvince(this.miyaLibrary, 'province 1');
                this.guardsman = this.player1.findCardByName('seppun-guardsman');
                this.player1.moveCard(this.guardsman, 'dynasty deck');
                this.player1.moveCard(this.miyaSatoshi, 'dynasty deck');
                this.player1.moveCard(this.kanjo, 'dynasty deck');
                this.player1.moveCard(this.adept, 'dynasty deck');
                this.player1.moveCard(this.kudaka, 'dynasty deck');

            });

            it('should allow you to replace the library for satoshi', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.getChatLogs(1)).toContain('player1 uses Miya Library to search the top four cards of their dynasty deck for an Imperial character');
                expect(this.player1).toHavePrompt('Select an Imperial character to replace Miya Library');
                expect(this.player1).not.toHavePromptButton('Seppun Guardsman');
                this.player1.clickPrompt('Miya Satoshi');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                this.player1.clickPrompt('Adept of the Waves');
                expect(this.player1).toHavePrompt('Which card do you want to be the third card?');
                this.player1.clickPrompt('Kudaka');
                expect(this.player1.dynastyDeck[4]).toBe(this.guardsman);
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.miyaSatoshi.location).toBe('province 1');
                expect(this.miyaSatoshi.facedown).toBe(false);
                expect(this.miyaLibrary.location).toBe('dynasty deck');
                this.player2.pass();
                this.player1.clickCard(this.miyaSatoshi);
                this.player1.clickPrompt('1');
                expect(this.miyaSatoshi.location).toBe('play area');
            });

            it('should not let you select an imperial holding', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).not.toBeAbleToSelect('Kanjo District');
                expect(this.player1).toHavePrompt('Select an Imperial character to replace Miya Library');
                expect(this.player1).not.toHavePromptButton('Kanjo District');
                expect(this.player1).toHavePromptButton('Miya Satoshi');
            });

            it('should still let you rearrange your deck if there is not an imperial character', function () {
                this.player1.moveCard(this.naiveStudent, 'dynasty deck');
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).not.toBeAbleToSelect(this.miyaSatoshi);
                expect(this.player1).toHavePrompt('Select an Imperial character to replace Miya Library');
                this.player1.clickPrompt('Do not replace Miya Library');
                this.player1.clickPrompt('Kudaka');
                this.player1.clickPrompt('Naive Student');
                this.player1.clickPrompt('Adept of the Waves');
            });

            it('should put the card back in the right order', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).toHavePrompt('Select an Imperial character to replace Miya Library');
                this.player1.clickPrompt('Miya Satoshi');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                this.player1.clickPrompt('Adept of the Waves');
                expect(this.player1).toHavePrompt('Which card do you want to be the third card?');
                this.player1.clickPrompt('Kudaka');
                this.player1.moveCard(this.player1.player.dynastyDeck[0], 'dynasty discard pile');
                expect(this.kanjo.location).toBe('dynasty discard pile');
                this.player1.moveCard(this.player1.player.dynastyDeck[0], 'dynasty discard pile');
                expect(this.adept.location).toBe('dynasty discard pile');
                this.player1.moveCard(this.player1.player.dynastyDeck[0], 'dynasty discard pile');
                expect(this.kudaka.location).toBe('dynasty discard pile');
                this.player1.moveCard(this.player1.player.dynastyDeck[0], 'dynasty discard pile');
                expect(this.miyaLibrary.location).toBe('dynasty discard pile');
            });

            it('should work if the player has less four card in their dynasty deck', function () {
                for(var i = this.player1.dynastyDeck.length - 1; i >= 0; i--) {
                    this.player1.moveCard(this.player1.dynastyDeck[i], 'dynasty discard pile');
                }
                this.player1.moveCard(this.miyaSatoshi, 'dynasty deck');
                this.player1.moveCard(this.kanjo, 'dynasty deck');
                this.player1.clickCard(this.miyaLibrary);
                this.player1.clickPrompt('Do not replace Miya Library');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });
    });
});

describe('Miya Library and Hantei XXXVIII', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['miya-library', 'kanjo-district', 'miya-satoshi', 'adept-of-the-waves', 'kudaka'],
                    dynastyDeck: []
                },
                player2: {
                    inPlay: ['hantei-xxxviii']
                }
            });
            this.miyaLibrary = this.player1.findCardByName('miya-library');
            this.miyaSatoshi = this.player1.findCardByName('miya-satoshi');
            this.hantei = this.player2.findCardByName('hantei-xxxviii');
            this.player1.placeCardInProvince(this.miyaLibrary, 'province 1');
            for(const name of ['miya-satoshi', 'kanjo-district', 'adept-of-the-waves', 'kudaka']) {
                this.player1.moveCard(this.player1.findCardByName(name), 'dynasty deck');
            }
        });

        it('chooses no card; the cards are put back in any order', function () {
            this.player1.clickCard(this.miyaLibrary);
            expect(this.player2).toBeAbleToSelect(this.hantei);
            this.player2.clickCard(this.hantei);
            expect(this.player2).not.toHavePrompt('Select an Imperial character to replace Miya Library');
            expect(this.player1).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
            this.player1.clickPrompt('Miya Satoshi');
            this.player1.clickPrompt('Kudaka');
            this.player1.clickPrompt('Kanjo District');
            expect(this.player1.dynastyDeck[0]).toBe(this.miyaSatoshi);
            expect(this.miyaLibrary.location).toBe('province 1');
            expect(this.player2).toHavePrompt('Play cards from provinces');
        });
    });
});

describe('Miya Library copied by Floating Fortress', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat']
                },
                player2: {
                    inPlay: ['brash-samurai'],
                    dynastyDiscard: ['floating-fortress', 'miya-library', 'miya-satoshi', 'kudaka', 'adept-of-the-waves', 'naive-student']
                }
            });
            this.fortress = this.player2.findCardByName('floating-fortress');
            this.library = this.player2.findCardByName('miya-library');
            this.satoshi = this.player2.findCardByName('miya-satoshi');
            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.player2.reduceDeckToNumber('dynasty deck', 0);
            for(const name of ['naive-student', 'adept-of-the-waves', 'kudaka', 'miya-satoshi']) {
                this.player2.moveCard(name, 'dynasty deck');
            }
            this.player2.placeCardInProvince(this.fortress, 'province 2');
            this.fortress.facedown = false;
        });

        it('puts the copy back with the other cards', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: ['doji-diplomat'],
                defenders: ['brash-samurai'],
                province: this.sd1
            });
            this.player2.clickCard(this.fortress);
            this.player2.clickCard(this.library);
            this.player2.clickPrompt('No');
            this.player1.pass();
            this.player2.clickCard(this.fortress);
            this.player2.clickPrompt('Miya Satoshi');
            expect(this.satoshi.location).toBe('province 2');
            expect(this.fortress.location).toBe('dynasty deck');
            expect(this.player2).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
            expect(this.player2).toHavePromptButton('Floating Fortress');
        });
    });
});
