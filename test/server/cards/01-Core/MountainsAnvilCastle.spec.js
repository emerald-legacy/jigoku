describe('Mountain\'s Anvil Castle', function() {
    integration(function() {
        describe('Mountain\'s Anvil Castle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'mountain-s-anvil-castle',
                        inPlay: ['border-rider'],
                        hand: ['fine-katana', 'ornate-fan', 'daimyo-s-favor']
                    },
                    player2: {
                        inPlay: ['togashi-initiate']
                    }
                });
                this.mountainsAnvil = this.player1.findCardByName('mountain-s-anvil-castle');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.daimyosFavor = this.player1.findCardByName('daimyo-s-favor');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
            });

            it('should not be triggerable outside of a conflict', function() {
                this.player1.playAttachment(this.fineKatana, this.borderRider);
                this.player2.pass();
                this.player1.clickCard(this.mountainsAnvil);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.mountainsAnvil.bowed).toBe(false);
            });

            it('should not target a participating character without attachments', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.mountainsAnvil);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
            });

            it('should give +1/+1 when target has 1 attachment', function() {
                this.player1.playAttachment(this.fineKatana, this.borderRider);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();

                let mil = this.borderRider.getMilitarySkill();
                let pol = this.borderRider.getPoliticalSkill();
                this.player1.clickCard(this.mountainsAnvil);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                this.player1.clickCard(this.borderRider);
                expect(this.borderRider.getMilitarySkill()).toBe(mil + 1);
                expect(this.borderRider.getPoliticalSkill()).toBe(pol + 1);
                expect(this.mountainsAnvil.bowed).toBe(true);
            });

            it('should cap the bonus at +2/+2 when target has 3 attachments', function() {
                this.player1.playAttachment(this.fineKatana, this.borderRider);
                this.player2.pass();
                this.player1.playAttachment(this.ornateFan, this.borderRider);
                this.player2.pass();
                this.player1.playAttachment(this.daimyosFavor, this.borderRider);
                expect(this.borderRider.attachments.length).toBe(3);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();

                let mil = this.borderRider.getMilitarySkill();
                let pol = this.borderRider.getPoliticalSkill();
                this.player1.clickCard(this.mountainsAnvil);
                this.player1.clickCard(this.borderRider);
                expect(this.borderRider.getMilitarySkill()).toBe(mil + 2);
                expect(this.borderRider.getPoliticalSkill()).toBe(pol + 2);
            });
        });
    });
});
