describe('Battle Maiden Recruit', function() {
    integration(function() {
        describe('Battle Maiden Recruit\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['battle-maiden-recruit']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.maiden = this.player1.findCardByName('battle-maiden-recruit');
                this.noMoreActions();
            });

            function worksWithRing(ringType) {
                it('should give +2 to military skill if the ' + ringType + ' ring is claimed',
                    function() {
                        const military = this.maiden.militarySkill;
                        this.player1.claimRing(ringType);
                        expect(this.maiden.militarySkill).toBe(military + 2);
                    }
                );
            }

            for(const ringType of ['water', 'void']) {
                worksWithRing(ringType);
            }

            function doesntWorkWithRing(ringType) {
                it('should not give +2 to military skill if the ' + ringType + ' ring is claimed',
                    function() {
                        const military = this.maiden.militarySkill;
                        this.player1.claimRing(ringType);
                        expect(this.maiden.militarySkill).toBe(military);
                    }
                );
            }

            for(const ringType of ['air', 'earth', 'fire']) {
                doesntWorkWithRing(ringType);
            }

            it('should not give +2 to military skill if the opponent claimed the air or water ring', function() {
                const military = this.maiden.militarySkill;
                this.player2.claimRing('air');
                this.player2.claimRing('water');
                expect(this.maiden.militarySkill).toBe(military);
            });
        });
    });
});
