describe('Ebony Blood Garrison', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    stronghold: 'ebony-blood-garrison',
                    inPlay: [],
                    hand: [],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: [],
                    provinces: ['entrenched-position']
                }
            });

            this.ebonyBloodGarrison = this.player1.findCardByName('ebony-blood-garrison');
            this.manicuredGarden = this.player1.findCardByName('manicured-garden');
            this.crabStrongholdProvince = this.player1.findCardByName('shameful-display', 'stronghold province');
            this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
            this.opponentStrongholdProvince = this.player2.findCardByName('shameful-display', 'stronghold province');

            this.noMoreActions();
        });

        it('triggers when dynasty phase ends', function () {
            expect(this.player1).toHavePrompt('Any reactions to dynasty phase ending?');
            expect(this.player1).toBeAbleToSelect(this.ebonyBloodGarrison);
        });

        it('chooses non stronghold provinces', function () {
            const initialFate = this.player1.fate;
            const initalHandSize = this.player1.hand.length;
            this.player1.clickCard(this.ebonyBloodGarrison);
            expect(this.player1).toHavePrompt('Choose a province');
            expect(this.player1).toBeAbleToSelect(this.manicuredGarden);
            expect(this.player1).not.toBeAbleToSelect(this.crabStrongholdProvince);

            this.player1.clickCard(this.manicuredGarden);
            expect(this.player1).toHavePrompt('Choose a province');
            expect(this.player1).toBeAbleToSelect(this.entrenchedPosition);
            expect(this.player1).not.toBeAbleToSelect(this.opponentStrongholdProvince);

            this.player1.clickCard(this.entrenchedPosition);
            expect(this.manicuredGarden.isBroken).toBe(true);
            expect(this.player2).toHavePrompt('Do you wish to discard Adept of the Waves?');

            this.player2.clickPrompt('Yes');
            expect(this.entrenchedPosition.isBroken).toBe(true);
            expect(this.player1).toHavePrompt('Do you wish to discard Adept of the Waves?');

            this.player1.clickPrompt('Yes');
            expect(this.getChatLogs(10)).toContain(
                'player1 uses Ebony Blood Garrison, bowing Ebony Blood Garrison to drag player2 into chaos'
            );
            expect(this.player1.fate).toBe(initialFate + 1);
            expect(this.player1.hand.length).toBe(initalHandSize + 1);
        });
    });
});
