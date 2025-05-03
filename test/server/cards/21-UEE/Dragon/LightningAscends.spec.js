describe('Lightning Ascends', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['itinerant-philosopher', 'agasha-sumiko'],
                    hand: ['lightning-ascends']
                },
                player2: {
                    inPlay: ['solemn-scholar']
                }
            });
            this.itinerantPhilosopher = this.player1.findCardByName('itinerant-philosopher');
            this.agashaSumiko = this.player1.findCardByName('agasha-sumiko');
            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.lightningAscends = this.player1.findCardByName('lightning-ascends');
            this.noMoreActions();
        });

        it('only works on participating characters', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.itinerantPhilosopher],
                defenders: [this.solemnScholar]
            });
            this.player2.pass();
            this.player1.clickCard(this.lightningAscends);
            expect(this.player1).toHavePrompt('Lightning Ascends');
            expect(this.player1).toBeAbleToSelect(this.itinerantPhilosopher);
            expect(this.player1).not.toBeAbleToSelect(this.agashaSumiko);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

            this.player1.clickCard(this.itinerantPhilosopher);
            expect(this.player1).toHavePrompt('Choose a character to lose all traits');
            expect(this.player1).not.toBeAbleToSelect(this.agashaSumiko);
            expect(this.player1).not.toBeAbleToSelect(this.itinerantPhilosopher);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
        });

        it('gives +2/+0 and removes traits from opponent', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.itinerantPhilosopher, this.agashaSumiko],
                defenders: [this.solemnScholar]
            });
            this.player2.pass();
            let currentMilitarySkill = this.itinerantPhilosopher.getMilitarySkill();
            let currentPoliticalSkill = this.itinerantPhilosopher.getPoliticalSkill();

            this.player1.clickCard(this.lightningAscends);
            this.player1.clickCard(this.itinerantPhilosopher);
            this.player1.clickCard(this.solemnScholar);

            expect(this.itinerantPhilosopher.getMilitarySkill()).toBe(currentMilitarySkill + 2);
            expect(this.itinerantPhilosopher.getPoliticalSkill()).toBe(currentPoliticalSkill);

            expect(this.solemnScholar.getTraitSet().size).toBe(0);

            expect(this.getChatLogs(3)).toContain(
                'player1 plays Lightning Ascends to grant +2 military to Itinerant Philosopher and removes all traits from Solemn Scholar'
            );
        });
    });
});
