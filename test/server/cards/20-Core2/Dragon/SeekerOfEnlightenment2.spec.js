describe('Seeker of Enlightenment 2', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['seeker-of-enlightenment-2']
                },
                player2: {
                    inPlay: ['togashi-initiate']
                }
            });

            this.seeker = this.player1.findCardByName('seeker-of-enlightenment-2');
            this.togashiInitiate = this.player2.findCardByName('togashi-initiate');

            for(const ring of Object.values(this.game.rings)) {
                ring.fate = 0;
            }
        });

        it('should have its printed skills when there is no fate on the rings', function() {
            this.game.checkGameState(true);
            expect(this.seeker.getMilitarySkill()).toBe(1);
            expect(this.seeker.getPoliticalSkill()).toBe(2);
        });

        it('should get +1 military and +1 political for each fate on each ring', function() {
            this.game.rings.air.fate = 2;
            this.game.rings.fire.fate = 1;
            this.game.rings.void.fate = 1;
            this.game.checkGameState(true);
            expect(this.seeker.getMilitarySkill()).toBe(5);
            expect(this.seeker.getPoliticalSkill()).toBe(6);
            expect(this.togashiInitiate.getMilitarySkill()).toBe(1);
        });

        it('should lose the bonus when fate is taken off a ring', function() {
            this.game.rings.water.fate = 2;
            this.game.checkGameState(true);
            expect(this.seeker.getMilitarySkill()).toBe(3);
            const fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                ring: 'water',
                attackers: [this.seeker]
            });
            expect(this.game.rings.water.fate).toBe(0);
            expect(this.player1.fate).toBe(fate + 2);
            expect(this.seeker.getMilitarySkill()).toBe(1);
            expect(this.seeker.getPoliticalSkill()).toBe(2);
        });
    });
});
