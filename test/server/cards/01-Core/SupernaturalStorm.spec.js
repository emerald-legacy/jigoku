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

        describe('played from hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'fire-tensai-initiate', 'young-philosopher'],
                        hand: ['supernatural-storm'],
                        dynastyDeck: ['funeral-pyre']
                    },
                    player2: {
                        inPlay: ['fire-tensai-initiate', 'doji-whisperer']
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.tensai = this.player1.findCardByName('fire-tensai-initiate');
                this.philosopher = this.player1.findCardByName('young-philosopher');
                this.storm = this.player1.findCardByName('supernatural-storm');
                this.pyre = this.player1.placeCardInProvince('funeral-pyre', 'province 1');
                this.opponentTensai = this.player2.findCardByName('fire-tensai-initiate');
                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.challenger],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
            });

            it('gives the chosen character +X military and +X political where X is the number of Shugenja you control', function() {
                this.player1.clickCard(this.storm);
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.challenger);
                expect(this.challenger.militarySkill).toBe(5);
                expect(this.challenger.politicalSkill).toBe(5);
                expect(this.getChatLogs(3)).toContain('player1 plays Supernatural Storm to imbue Doji Challenger with the supernatural power of the storm');
            });

            it('can only choose a participating character', function() {
                this.player1.clickCard(this.storm);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.challenger);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.tensai);
                expect(this.player1).not.toBeAbleToSelect(this.philosopher);
                expect(this.player1).not.toBeAbleToSelect(this.opponentTensai);
            });

            it('keeps the bonus when the number of your Shugenja changes afterwards (ruling #111)', function() {
                this.player1.clickCard(this.storm);
                this.player1.clickCard(this.challenger);
                expect(this.challenger.politicalSkill).toBe(5);
                this.player2.pass();
                this.player1.clickCard(this.pyre);
                this.player1.clickCard(this.tensai);
                expect(this.tensai.location).toBe('dynasty discard pile');
                expect(this.challenger.militarySkill).toBe(5);
                expect(this.challenger.politicalSkill).toBe(5);
            });
        });
    });
});
