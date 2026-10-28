describe('High Kick', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['togashi-initiate', 'border-rider'],
                    hand: ['high-kick', 'togashi-kazue']
                },
                player2: {
                    inPlay: ['adept-of-the-waves', 'utaku-mediator', 'doji-whisperer']
                }
            });

            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.rider = this.player1.findCardByName('border-rider');
            this.highKick = this.player1.findCardByName('high-kick');
            this.kazue = this.player1.findCardByName('togashi-kazue');

            this.adept = this.player2.findCardByName('adept-of-the-waves');
            this.mediator = this.player2.findCardByName('utaku-mediator');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        describe('during a military conflict', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.initiate, this.rider],
                    defenders: [this.adept, this.mediator]
                });
                this.player2.pass();
            });

            it('should bow a participating Monk as a cost and bow a participating opposing character', function() {
                this.player1.clickCard(this.highKick);
                expect(this.player1).toHavePrompt('High Kick');
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).toBeAbleToSelect(this.mediator);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.rider);
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Select card to bow');
                expect(this.player1).toBeAbleToSelect(this.initiate);
                expect(this.player1).not.toBeAbleToSelect(this.rider);
                this.player1.clickCard(this.initiate);
                expect(this.initiate.bowed).toBe(true);
                expect(this.rider.bowed).toBe(false);
                expect(this.adept.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 plays High Kick, bowing Togashi Initiate to bow Adept of the Waves and prevent them from using abilities');
            });

            it('should stop the character triggering its abilities during the conflict', function() {
                this.player1.clickCard(this.highKick);
                this.player1.clickCard(this.adept);
                this.player1.clickCard(this.initiate);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.adept.bowed).toBe(true);
            });

            it('should let the character trigger its abilities again after the conflict', function() {
                this.player1.clickCard(this.highKick);
                this.player1.clickCard(this.adept);
                this.player1.clickCard(this.initiate);
                this.noMoreActions();
                expect(this.getChatLogs(10)).toContain('player1 won a military conflict 2 vs 1');
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.currentConflict).toBe(null);
                this.player1.clickPrompt('Pass');
                this.player2.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Adept of the Waves');
            });

            // ruling #159: constant abilities are not affected
            it('should not stop constant abilities', function() {
                expect(this.mediator.getMilitarySkill()).toBe(1);
                this.player1.clickCard(this.highKick);
                this.player1.clickCard(this.mediator);
                this.player1.clickCard(this.initiate);
                expect(this.mediator.bowed).toBe(true);
                expect(this.mediator.getMilitarySkill()).toBe(1);
            });
        });

        describe('when no Monk character is participating', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    defenders: [this.adept]
                });
                this.player2.pass();
            });

            it('should not be playable with a Monk at home', function() {
                this.player1.clickCard(this.highKick);
                expect(this.highKick.location).toBe('hand');
                expect(this.initiate.bowed).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            // ruling #456: a Monk played as an attachment is not a character
            it('should not be able to bow a Monk played as an attachment', function() {
                this.player1.playAttachment(this.kazue, this.rider);
                expect(this.rider.attachments).toContain(this.kazue);
                this.player2.pass();
                this.player1.clickCard(this.highKick);
                expect(this.highKick.location).toBe('hand');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        it('should not be playable during a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.initiate, this.rider],
                defenders: [this.adept]
            });
            this.player2.pass();
            this.player1.clickCard(this.highKick);
            expect(this.highKick.location).toBe('hand');
            expect(this.initiate.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
