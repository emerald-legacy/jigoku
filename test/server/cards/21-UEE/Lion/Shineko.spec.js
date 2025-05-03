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
    });
});
