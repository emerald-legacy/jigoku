describe('Doji Representative', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-representative', 'matsu-berserker']
                },
                player2: {
                    inPlay: ['shiba-peacemaker']
                }
            });
            this.representative = this.player1.findCardByName('doji-representative');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
        });

        it('moves itself home from the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.representative, this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.representative);
            expect(this.representative.isParticipating()).toBe(false);
            expect(this.representative.location).toBe('play area');
            expect(this.berserker.isParticipating()).toBe(true);
        });

        it('cannot be used while already at home during a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.representative);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.representative.isParticipating()).toBe(false);
        });

        it('cannot be used outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.representative);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
