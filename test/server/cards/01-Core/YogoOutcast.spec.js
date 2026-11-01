describe('Yogo Outcast', function() {
    integration(function() {
        describe('while less honorable', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yogo-outcast']
                    },
                    player2: {
                        honor: 11
                    }
                });
                this.outcast = this.player1.findCardByName('yogo-outcast');
            });

            it('gets +1 military and +1 political while you are less honorable than your opponent', function() {
                expect(this.outcast.militarySkill).toBe(3);
                expect(this.outcast.politicalSkill).toBe(3);
            });

            it('loses the bonus once you are no longer less honorable', function() {
                expect(this.outcast.militarySkill).toBe(3);
                this.player1.honor = 12;
                this.game.checkGameState(true);
                expect(this.outcast.militarySkill).toBe(2);
                expect(this.outcast.politicalSkill).toBe(2);
            });
        });

        describe('while as honorable', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['yogo-outcast']
                    },
                    player2: {
                        honor: 11
                    }
                });
                this.outcast = this.player1.findCardByName('yogo-outcast');
            });

            it('gets no bonus while you are as honorable as your opponent', function() {
                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(11);
                expect(this.outcast.militarySkill).toBe(2);
                expect(this.outcast.politicalSkill).toBe(2);
            });
        });

        describe('while more honorable', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 12,
                        inPlay: ['yogo-outcast']
                    },
                    player2: {
                        honor: 11
                    }
                });
                this.outcast = this.player1.findCardByName('yogo-outcast');
            });

            it('gets no bonus while you are more honorable than your opponent', function() {
                expect(this.player1.honor).toBe(12);
                expect(this.outcast.militarySkill).toBe(2);
                expect(this.outcast.politicalSkill).toBe(2);
            });
        });
    });
});
