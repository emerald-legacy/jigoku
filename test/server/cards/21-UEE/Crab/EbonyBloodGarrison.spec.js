describe('Ebony Blood Garrison', () => {
    integration(() => {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    stronghold: 'ebony-blood-garrison',
                    inPlay: ['hida-guardian'],
                    hand: [],
                    provinces: ['manicured-garden', 'avalanche-of-stone']
                },
                player2: {
                    inPlay: [],
                    provinces: ['entrenched-position', 'retire-to-the-brotherhood']
                }
            });

            this.ebonyBloodGarrison = this.player1.findCardByName('ebony-blood-garrison');
            this.manicuredGarden = this.player1.findCardByName('manicured-garden');
            this.crabStrongholdProvince = this.player1.findCardByName('shameful-display', 'stronghold province');
            this.avalancheOfStone = this.player1.findCardByName('avalanche-of-stone');
            this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
            this.opponentStrongholdProvince = this.player2.findCardByName('shameful-display', 'stronghold province');
            this.retireToTheBrotherhood = this.player2.findCardByName('retire-to-the-brotherhood');

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
            expect(this.entrenchedPosition.isBroken).toBe(true);
            expect(this.getChatLogs(10)).toContain(
                "player1 uses Ebony Blood Garrison, bowing Ebony Blood Garrison to drag player2 into chaos, as a crisis strikes Manicured Garden and Entrenched Position"
            );
            expect(this.player1.fate).toBe(initialFate + 1);
            expect(this.player1.hand.length).toBe(initalHandSize + 1);
        });

        it('triggers on-reveal abilities', function () {
            const initialFate = this.player1.fate;
            const initalHandSize = this.player1.hand.length;

            this.player1.clickCard(this.ebonyBloodGarrison);
            this.player1.clickCard(this.avalancheOfStone);
            this.player1.clickCard(this.retireToTheBrotherhood);
            expect(this.getChatLogs(10)).toContain("player1 uses Ebony Blood Garrison, bowing Ebony Blood Garrison to drag player2 into chaos, as a crisis strikes Avalanche of Stone and Retire to the Brotherhood");
            expect(this.player1).toHavePrompt('Any reactions?');

            this.player1.clickCard(this.avalancheOfStone);
            expect(this.getChatLogs(1)).toContain("player1 uses Avalanche of Stone to bow Hida Guardian");
            expect(this.player2).toHavePrompt('Any reactions?');

            this.player2.clickCard(this.retireToTheBrotherhood);
            expect(this.getChatLogs(10)).toContain("player2 uses Retire to the Brotherhood to discard Hida Guardian");
            expect(this.avalancheOfStone.isBroken).toBe(true);
            expect(this.retireToTheBrotherhood.isBroken).toBe(true);
            expect(this.player1.fate).toBe(initialFate + 1);
            expect(this.player1.hand.length).toBe(initalHandSize + 1);
        });
    });
});