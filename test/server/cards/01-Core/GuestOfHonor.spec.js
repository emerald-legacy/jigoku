describe('Guest of Honor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['guest-of-honor', 'brash-samurai']
                },
                player2: {
                    fate: 5,
                    inPlay: ['moto-horde', 'togashi-initiate', 'bayushi-kachiko'],
                    hand: ['banzai', 'fallen-in-battle', 'mantra-of-fire']
                }
            });
            this.guest = this.player1.findCardByName('guest-of-honor');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.horde = this.player2.findCardByName('moto-horde');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.kachiko = this.player2.findCardByName('bayushi-kachiko');
            this.banzai = this.player2.findCardByName('banzai');
            this.fallen = this.player2.findCardByName('fallen-in-battle');
            this.mantra = this.player2.findCardByName('mantra-of-fire');
            this.noMoreActions();
        });

        it('stops the opponent from playing events while she is participating', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.guest, this.brash],
                defenders: [this.horde]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.banzai);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2).not.toBeAbleToSelect(this.horde);
            expect(this.banzai.location).toBe('hand');
        });

        it('lets the opponent play events while she is not participating', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.brash],
                defenders: [this.horde]
            });
            this.player2.clickCard(this.banzai);
            expect(this.player2).toBeAbleToSelect(this.horde);
            expect(this.player2).toBeAbleToSelect(this.brash);
        });

        it('lets the opponent play events again once she has been moved home', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.guest, this.brash],
                defenders: [this.kachiko]
            });
            this.player2.clickCard(this.banzai);
            expect(this.banzai.location).toBe('hand');
            this.player2.clickCard(this.kachiko);
            this.player2.clickCard(this.guest);
            this.player2.clickPrompt('No');
            expect(this.guest.isParticipating()).toBe(false);
            this.player1.pass();
            this.player2.clickCard(this.banzai);
            expect(this.player2).toBeAbleToSelect(this.kachiko);
        });

        it('stops reactions to winning the conflict, as she is still participating (ruling #49)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.guest],
                defenders: [this.horde]
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 6 vs 1');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.fallen);
            expect(this.fallen.location).toBe('hand');
        });

        it('stops reactions to the conflict being declared when she is attacking (ruling #468)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.guest]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.mantra);
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.mantra.location).toBe('hand');
        });

        it('allows reactions to the conflict being declared when she is not attacking', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.brash]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.mantra);
        });
    });
});
