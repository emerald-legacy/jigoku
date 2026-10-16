describe('Supernatural Storm', function() {
    integration(function() {
        describe('copied by Illustrious Plagiarist', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        conflictDiscard: ['supernatural-storm']
                    }
                });
                this.plagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.storm = this.player2.findCardByName('supernatural-storm');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.plagiarist],
                    defenders: [this.challenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.plagiarist);
                this.player1.clickCard(this.storm);
                this.player2.pass();
            });

            it('counts the Shugenja of the player who uses it', function() {
                const political = this.plagiarist.politicalSkill;
                this.player1.clickCard(this.plagiarist);
                expect(this.player1).toBeAbleToSelect(this.plagiarist);
                this.player1.clickCard(this.plagiarist);
                expect(this.plagiarist.politicalSkill).toBe(political + 1);
            });
        });
    });
});
