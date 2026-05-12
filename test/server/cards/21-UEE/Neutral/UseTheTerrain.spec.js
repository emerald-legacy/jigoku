describe('Use the Terrain', function () {
    integration(function () {
        describe('without scout', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'solemn-scholar'],
                        hand: ['use-the-terrain']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: []
                    }
                });

                this.rider = this.player1.findCardByName('border-rider');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.terrain = this.player1.findCardByName('use-the-terrain');
                this.challenger = this.player2.findCardByName('doji-challenger');
            });

            it('should give +1 military to all characters you control', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    defenders: [this.challenger]
                });

                let riderMil = this.rider.getMilitarySkill();
                let scholarMil = this.scholar.getMilitarySkill();

                this.player2.pass();
                this.player1.clickCard(this.terrain);
                expect(this.rider.getMilitarySkill()).toBe(riderMil + 1);
                expect(this.scholar.getMilitarySkill()).toBe(scholarMil + 1);
                expect(this.getChatLogs(5)).toContain('player1 plays Use the Terrain to give all characters they control +1military');
            });

            it('should not be playable outside a military conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.rider],
                    defenders: [this.challenger]
                });

                this.player2.pass();
                this.player1.clickCard(this.terrain);
                expect(this.terrain.location).toBe('hand');
            });
        });

        describe('with a participating scout', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'eager-scout'],
                        hand: ['use-the-terrain']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: []
                    }
                });

                this.rider = this.player1.findCardByName('border-rider');
                this.scout = this.player1.findCardByName('eager-scout');
                this.terrain = this.player1.findCardByName('use-the-terrain');
                this.challenger = this.player2.findCardByName('doji-challenger');
            });

            it('should give +2 military to all characters you control', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider, this.scout],
                    defenders: [this.challenger]
                });

                let riderMil = this.rider.getMilitarySkill();
                this.player2.pass();
                this.player1.clickCard(this.terrain);
                expect(this.rider.getMilitarySkill()).toBe(riderMil + 2);
                expect(this.getChatLogs(5)).toContain('player1 plays Use the Terrain to give all characters they control +2military');
            });
        });
    });
});
