describe('Shineko', function () {
    integration(function () {
        describe('Discount ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['ikoma-master-hunter', 'young-beastmaster', 'matsu-berserker'],
                        dynastyDiscard: ['shineko']
                    },
                    player2: {
                        inPlay: [],
                        hand: []
                    }
                });

                this.shineko = this.player1.placeCardInProvince('shineko');
                this.ikomaMasterHunter = this.player1.findCardByName('ikoma-master-hunter');
                this.youngBeastmaster = this.player1.findCardByName('young-beastmaster');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            });

            it('costs 3 fate without discount', function () {
                this.player1.player.moveCard(this.ikomaMasterHunter, 'dynasty deck');
                this.player1.player.moveCard(this.youngBeastmaster, 'dynasty deck');
                const initialFate = this.player1.fate;

                this.player1.clickCard(this.shineko);
                this.player1.clickPrompt('0');
                expect(this.player1.fate).toBe(initialFate - 3);
            });

            it('costs 2 fate with discount from scout', function () {
                this.player1.player.moveCard(this.youngBeastmaster, 'dynasty deck');
                const initialFate = this.player1.fate;

                this.player1.clickCard(this.shineko);
                this.player1.clickPrompt('0');
                expect(this.player1.fate).toBe(initialFate - 2);
            });

            it('costs 2 fate with discount from beastmaster', function () {
                this.player1.player.moveCard(this.ikomaMasterHunter, 'dynasty deck');
                const initialFate = this.player1.fate;

                this.player1.clickCard(this.shineko);
                this.player1.clickPrompt('0');
                expect(this.player1.fate).toBe(initialFate - 2);
            });

            it('discount is not cummulative', function () {
                const initialFate = this.player1.fate;

                this.player1.clickCard(this.shineko);
                this.player1.clickPrompt('0');
                expect(this.player1.fate).toBe(initialFate - 2);
            });
        });

        describe('Discount ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shineko', 'matsu-berserker']
                    },
                    player2: {
                        inPlay: ['daidoji-ienori'],
                        hand: ['for-shame','at-any-cost']
                    }
                });

                this.shineko = this.player1.findCardByName('shineko');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.daidojiIenori = this.player2.findCardByName('daidoji-ienori');
                this.forShame = this.player2.findCardByName('for-shame');
                this.atAnyCost = this.player2.findCardByName('at-any-cost');
            });

            it('intercepts events', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shineko, this.matsuBerserker],
                    defenders: [this.daidojiIenori]
                });
                this.player2.clickCard(this.forShame);
                expect(this.player2).toBeAbleToSelect(this.shineko);
                expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
            });

            it('intercepts character abilities', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shineko, this.matsuBerserker],
                    defenders: [this.daidojiIenori]
                });
                this.player2.clickCard(this.daidojiIenori);
                expect(this.player2).toBeAbleToSelect(this.shineko);
                expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).not.toBeAbleToSelect(this.daidojiIenori);
            });

            it('does not work from home', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.matsuBerserker],
                    defenders: [this.daidojiIenori]
                });
                this.player2.clickCard(this.atAnyCost);
                expect(this.player2).toBeAbleToSelect(this.shineko);
                expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).toBeAbleToSelect(this.daidojiIenori);
            });

            it('does not work outside conflicts', function () {
                this.player1.pass();
                this.player2.clickCard(this.atAnyCost);
                expect(this.player2).toBeAbleToSelect(this.shineko);
                expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).toBeAbleToSelect(this.daidojiIenori);
            });
        });
    });
});
