describe('Pit Trap', function() {
    integration(function() {
        describe('Playing Pit Trap', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-gunso', 'matsu-berserker']
                    },
                    player2: {
                        fate: 5,
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['pit-trap']
                    }
                });
                this.gunso = this.player1.findCardByName('akodo-gunso');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.pitTrap = this.player2.findCardByName('pit-trap');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.gunso],
                    defenders: [this.challenger]
                });
            });

            it('should only be playable on an attacking character', function() {
                this.player2.clickCard(this.pitTrap);
                expect(this.player2).toBeAbleToSelect(this.gunso);
                expect(this.player2).not.toBeAbleToSelect(this.berserker);
                expect(this.player2).not.toBeAbleToSelect(this.challenger);
                expect(this.player2).not.toBeAbleToSelect(this.whisperer);
                this.player2.clickCard(this.gunso);
                expect(this.gunso.attachments).toContain(this.pitTrap);
                expect(this.player2.fate).toBe(2);
            });
        });

        describe('Pit Trap\'s persistent effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: [
                            { card: 'akodo-gunso', fate: 2, bowed: true, attachments: ['pit-trap'] },
                            { card: 'matsu-berserker', fate: 2, bowed: true }
                        ]
                    }
                });
                this.gunso = this.player1.findCardByName('akodo-gunso');
                this.berserker = this.player1.findCardByName('matsu-berserker');
            });

            it('should stop the attached character from readying at the end of the round', function() {
                expect(this.gunso.bowed).toBe(true);
                this.noMoreActions();
                expect(this.berserker.bowed).toBe(false);
                expect(this.gunso.bowed).toBe(true);
            });
        });
    });
});
