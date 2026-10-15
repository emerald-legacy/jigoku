describe('Reader Of Omens', function() {
    integration(function() {
        describe('Reader Of Omens\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['reader-of-omens']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.reader = this.player1.findCardByName('reader-of-omens');
                this.noMoreActions();
            });

            function worksWithRing(ringType) {
                it('should give +3 to political skill if the ' + ringType + ' ring is claimed',
                    function() {
                        const political = this.reader.politicalSkill;
                        this.player1.claimRing(ringType);
                        expect(this.reader.politicalSkill).toBe(political + 3);
                    }
                );
            }

            for(const ringType of ['air', 'void']) {
                worksWithRing(ringType);
            }

            function doesntWorkWithRing(ringType) {
                it('should not give +3 to political skill if the ' + ringType + ' ring is claimed',
                    function() {
                        const political = this.reader.politicalSkill;
                        this.player1.claimRing(ringType);
                        expect(this.reader.politicalSkill).toBe(political);
                    }
                );
            }

            for(const ringType of ['earth', 'fire', 'water']) {
                doesntWorkWithRing(ringType);
            }

            it('should not give +3 to political skill if the opponent claimed the air or void ring',
                function() {
                    const political = this.reader.politicalSkill;
                    this.player2.claimRing('air');
                    this.player2.claimRing('void');
                    expect(this.reader.politicalSkill).toBe(political);
                }
            );
        });
    });
});
