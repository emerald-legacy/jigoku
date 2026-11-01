describe('Golden Plains Outpost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'golden-plains-outpost',
                    inPlay: ['moto-youth', 'border-rider', 'brash-samurai', 'kakita-yoshi']
                },
                player2: {
                    inPlay: ['aggressive-moto', 'doji-whisperer']
                }
            });
            this.outpost = this.player1.findCardByName('golden-plains-outpost');
            this.youth = this.player1.findCardByName('moto-youth');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.aggressiveMoto = this.player2.findCardByName('aggressive-moto');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('bows the stronghold to move a Cavalry character you control to a military conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.outpost);
            expect(this.player1).toBeAbleToSelect(this.youth);
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            this.player1.clickCard(this.youth);
            expect(this.youth.isAttacking()).toBe(true);
            expect(this.outpost.bowed).toBe(true);
        });

        it('cannot choose a non-Cavalry character or a Cavalry character your opponent controls', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.outpost);
            expect(this.player1).toBeAbleToSelect(this.youth);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.aggressiveMoto);
        });

        it('cannot be used during a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.outpost);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.outpost.bowed).toBe(false);
            expect(this.youth.isParticipating()).toBe(false);
        });
    });
});
