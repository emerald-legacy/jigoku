describe('Agasha Shunsen', function () {
    integration(function () {
        describe('Agasha Shunsen\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-shunsen'],
                        conflictDeck: ['fine-katana']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.agashaShunsen = this.player1.findCardByName('agasha-shunsen');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['agasha-shunsen'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should not prompt the player to return a ring if none are claimed', function () {
                this.player1.clickCard(this.agashaShunsen);
                expect(this.player1).not.toHavePrompt('Choose a ring to return');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not prompt the player to select an attachment if the player chooses to cancel ring selection', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt the player to return a ring', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickCard(this.agashaShunsen);
                expect(this.player1).toHavePrompt('Choose a ring to return');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('air');
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                expect(this.player1).not.toBeAbleToSelectRing('water');
                expect(this.player1).not.toBeAbleToSelectRing('void');
            });

            it('should prompt the player to choose a card', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickRing('earth');
                expect(this.game.rings.earth.isUnclaimed()).toBe(true);
                expect(this.player1).toHavePrompt('Agasha Shunsen');
            });

            it('should attach the chosen card', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickRing('earth');
                this.player1.clickPrompt('Fine Katana');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                expect(this.agashaShunsen.attachments).toContain(this.fineKatana);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should still shuffle if no card is chosen to attach', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickCard(this.agashaShunsen);
                this.player1.clickRing('earth');
                this.chat = spyOn(this.game, 'addMessage');
                this.player1.clickPrompt('Don\'t attach a card');
                expect(this.chat).toHaveBeenCalledWith(['{0} chooses not to attach anything to {1}', [this.player1.player, this.agashaShunsen]]);
                expect(this.chat).toHaveBeenCalledWith(['{0} is shuffling their conflict deck', [this.player1.player]]);
            });
        });
    });
});

describe('Agasha Shunsen\'s cost cap', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['agasha-shunsen'],
                    conflictDeck: ['fine-katana', 'jade-tetsubo', 'daimyo-s-gunbai']
                },
                player2: {
                    inPlay: []
                }
            });
            this.agashaShunsen = this.player1.findCardByName('agasha-shunsen');
            this.jadeTetsubo = this.player1.findCardByName('jade-tetsubo');
            this.gunbai = this.player1.findCardByName('daimyo-s-gunbai');
            this.player1.claimRing('earth');
            this.player1.claimRing('water');
            this.noMoreActions();
            this.initiateConflict({
                ring: 'air',
                attackers: ['agasha-shunsen'],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.agashaShunsen);
            this.player1.clickCard(this.agashaShunsen);
        });

        it('offers only attachments costing up to the number of rings returned', function () {
            this.player1.clickRing('earth');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Agasha Shunsen');
            expect(this.player1).toHavePromptButton('Fine Katana');
            expect(this.player1).not.toHavePromptButton('Jade Tetsubō');
        });

        it('offers a cost 2 attachment after returning 2 rings, without paying for it (ruling #477)', function () {
            this.player1.clickRing('earth');
            this.player1.clickRing('water');
            expect(this.player1).toHavePromptButton('Jade Tetsubō');
            this.player1.clickPrompt('Jade Tetsubō');
            expect(this.agashaShunsen.attachments).toContain(this.jadeTetsubo);
            expect(this.player1.fate).toBe(5);
        });

        // ruling #651
        it('offers an attachment with a dash cost', function () {
            this.player1.clickRing('earth');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePromptButton('Daimyō\'s Gunbai');
            this.player1.clickPrompt('Daimyō\'s Gunbai');
            expect(this.agashaShunsen.attachments).toContain(this.gunbai);
        });
    });
});
