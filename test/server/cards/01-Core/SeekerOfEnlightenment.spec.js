describe('Seeker of Enlightenment', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['seeker-of-enlightenment', 'doji-whisperer']
                },
                player2: {
                    provinces: ['entrenched-position']
                }
            });
            this.seeker = this.player1.findCardByName('seeker-of-enlightenment');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
        });

        it('gets +1 military and +1 political for each fate on each unclaimed ring', function() {
            this.game.rings.air.fate = 0;
            this.game.rings.earth.fate = 0;
            this.game.rings.fire.fate = 2;
            this.game.rings.void.fate = 0;
            this.game.rings.water.fate = 1;
            this.game.checkGameState(true);
            expect(this.seeker.militarySkill).toBe(4);
            expect(this.seeker.politicalSkill).toBe(4);
        });

        it('does not count fate on a claimed ring', function() {
            this.game.rings.air.fate = 0;
            this.game.rings.earth.fate = 0;
            this.game.rings.fire.fate = 2;
            this.game.rings.void.fate = 0;
            this.game.rings.water.fate = 1;
            this.player2.claimRing('fire');
            expect(this.game.rings.fire.fate).toBe(2);
            expect(this.seeker.militarySkill).toBe(2);
            expect(this.seeker.politicalSkill).toBe(2);
        });

        it('does not count fate on the contested ring (ruling #140)', function() {
            this.game.rings.air.fate = 0;
            this.game.rings.earth.fate = 0;
            this.game.rings.fire.fate = 2;
            this.game.rings.void.fate = 0;
            this.game.rings.water.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                province: 'entrenched-position',
                attackers: [this.whisperer],
                defenders: []
            });
            this.game.rings.fire.fate = 2;
            this.game.checkGameState(true);
            expect(this.game.rings.fire.isContested()).toBe(true);
            expect(this.game.rings.fire.fate).toBe(2);
            expect(this.seeker.militarySkill).toBe(2);
            expect(this.seeker.politicalSkill).toBe(2);
        });
    });
});
