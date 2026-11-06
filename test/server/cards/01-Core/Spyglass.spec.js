describe('Spyglass', function() {
    integration(function() {
        describe('Spyglass\'s reaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [{ card: 'shinjo-outrider', attachments: ['spyglass'] }, 'doji-challenger']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'akodo-gunso'],
                        provinces: ['entrenched-position']
                    }
                });
                this.spyglass = this.player1.findCardByName('spyglass');
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.gunso = this.player2.findCardByName('akodo-gunso');
            });

            it('draws 1 card after the attached character is declared as an attacker', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.outrider]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                this.player1.clickCard(this.spyglass);
                expect(this.player1.hand.length).toBe(1);
            });

            it('does not trigger when only another character is declared as an attacker', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.challenger]
                });
                expect(this.challenger.isAttacking()).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('draws 1 card after the attached character is declared as a defender', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.gunso],
                    defenders: [this.outrider]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                this.player1.clickCard(this.spyglass);
                expect(this.player1.hand.length).toBe(1);
            });

            it('draws 1 card after the attached character moves to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.challenger],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.outrider);
                expect(this.outrider.isAttacking()).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                this.player1.clickCard(this.spyglass);
                expect(this.player1.hand.length).toBe(1);
            });

            it('can be used only twice per round', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.outrider]
                });
                this.player1.clickCard(this.spyglass);
                this.player2.clickPrompt('Done');
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1.hand.length).toBe(1);

                this.outrider.ready();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'void',
                    attackers: [this.whisperer],
                    defenders: [this.outrider]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.spyglass);
                expect(this.player1.hand.length).toBe(2);
                this.noMoreActions();
                expect(this.getChatLogs(10)).toContain('player1 won a military conflict 2 vs 0');

                this.outrider.ready();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    province: 'entrenched-position',
                    attackers: [this.outrider]
                });
                expect(this.outrider.isAttacking()).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
                expect(this.player1.hand.length).toBe(2);
            });
        });

        describe('Spyglass and a character removed from the conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [{ card: 'matsu-berserker', attachments: ['spyglass'] }, 'border-rider']
                    },
                    player2: {
                        provinces: ['rally-to-the-cause']
                    }
                });
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.spyglass = this.player1.findCardByName('spyglass');
                this.rally = this.player2.findCardByName('rally-to-the-cause');
            });

            it('can still be triggered after the attached character was removed from the conflict (ruling #533)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: this.rally,
                    attackers: [this.berserker, this.borderRider]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                this.player1.clickPrompt('Pass');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.rally);
                expect(this.berserker.isParticipating()).toBe(false);
                expect(this.berserker.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                this.player1.clickCard(this.spyglass);
                expect(this.player1.hand.length).toBe(1);
            });
        });
    });
});
