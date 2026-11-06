describe('Stoic Gunsō', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['stoic-gunso', 'doji-whisperer', 'border-rider']
                },
                player2: {
                    inPlay: ['akodo-gunso'],
                    provinces: ['entrenched-position']
                }
            });
            this.stoicGunso = this.player1.findCardByName('stoic-gunso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.akodoGunso = this.player2.findCardByName('akodo-gunso');
        });

        it('cannot be used outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.stoicGunso);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.whisperer.location).toBe('play area');
            expect(this.stoicGunso.militarySkill).toBe(2);
        });

        describe('during a conflict', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.stoicGunso, this.borderRider],
                    defenders: [this.akodoGunso]
                });
                this.player2.pass();
            });

            it('sacrifices a character you control to give itself +3 military', function() {
                this.player1.clickCard(this.stoicGunso);
                expect(this.player1).toHavePrompt('Select card to sacrifice');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.location).toBe('dynasty discard pile');
                expect(this.stoicGunso.militarySkill).toBe(5);
                expect(this.stoicGunso.politicalSkill).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('cannot sacrifice a character your opponent controls', function() {
                this.player1.clickCard(this.stoicGunso);
                expect(this.player1).toHavePrompt('Select card to sacrifice');
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.akodoGunso);
            });

            it('ends the bonus at the end of the conflict', function() {
                this.player1.clickCard(this.stoicGunso);
                this.player1.clickCard(this.whisperer);
                expect(this.stoicGunso.militarySkill).toBe(5);
                this.noMoreActions();
                expect(this.getChatLogs(10)).toContain('player1 won a military conflict 7 vs 2');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.game.currentConflict).toBe(null);
                expect(this.stoicGunso.militarySkill).toBe(2);
            });
        });
    });
});
