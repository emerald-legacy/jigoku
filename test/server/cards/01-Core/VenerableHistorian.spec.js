describe('Venerable Historian', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 11,
                    inPlay: ['venerable-historian', 'matsu-berserker']
                },
                player2: {
                    honor: 10,
                    inPlay: ['shiba-peacemaker']
                }
            });
            this.historian = this.player1.findCardByName('venerable-historian');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
        });

        it('honors itself while participating if you are more honorable', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.historian],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.historian);
            expect(this.historian.isHonored).toBe(true);
        });

        it('cannot be used while not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.historian);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.historian.isHonored).toBe(false);
        });

        it('cannot be used while you are as honorable as your opponent', function() {
            this.player1.honor = 10;
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.historian],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            expect(this.historian.isParticipating()).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.historian);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.historian.isHonored).toBe(false);
        });
    });
});
