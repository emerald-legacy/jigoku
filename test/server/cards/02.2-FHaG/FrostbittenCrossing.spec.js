describe('Frostbitten Crossing', function() {
    integration(function() {
        describe('Frostbitten Crossing\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['miya-mystic'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['border-rider'],
                        provinces: ['frostbitten-crossing']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.borderRider = this.player2.findCardByName('border-rider');
                this.frostbittenCrossing = this.player2.findCardByName('frostbitten-crossing', 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.borderRider],
                    province: this.frostbittenCrossing
                });
                this.player2.pass();
                this.player1.playAttachment('fine-katana', this.miyaMystic);
            });

            it('should only be usable during a conflict at this province', function() {
                expect(this.frostbittenCrossing.isConflictProvince()).toBe(true);
            });

            it('should discard all attachments from a participating character', function() {
                this.player2.clickCard(this.frostbittenCrossing);
                this.player2.clickCard(this.miyaMystic);
                expect(this.miyaMystic.attachments.length).toBe(0);
            });

            it('should not target characters without attachments', function() {
                this.player2.clickCard(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.miyaMystic);
                expect(this.player2).not.toBeAbleToSelect(this.borderRider);
            });
        });
    });
});
