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

            it('should discard all attachments from a participating character', function() {
                this.player2.clickCard(this.frostbittenCrossing);
                this.player2.clickCard(this.miyaMystic);
                expect(this.miyaMystic.attachments.length).toBe(0);
                expect(this.getChatLogs(3)).toContain('player2 uses Frostbitten Crossing to discard each attachment on Miya Mystic');
            });

            it('should not target characters without attachments', function() {
                this.player2.clickCard(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.miyaMystic);
                expect(this.player2).not.toBeAbleToSelect(this.borderRider);
            });
        });
    });
});

describe('Frostbitten Crossing during a conflict at another province', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['border-rider'],
                    provinces: ['frostbitten-crossing', 'shameful-display']
                }
            });
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.borderRider = this.player2.findCardByName('border-rider');
            this.frostbittenCrossing = this.player2.findCardByName('frostbitten-crossing', 'province 1');
            this.frostbittenCrossing.facedown = false;
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.miyaMystic],
                defenders: [this.borderRider],
                province: this.shamefulDisplay
            });
            this.player2.pass();
            this.katana = this.player1.playAttachment('fine-katana', this.miyaMystic);
        });

        it('can\'t be used', function() {
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.frostbittenCrossing);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.katana.parent).toBe(this.miyaMystic);
        });
    });
});
