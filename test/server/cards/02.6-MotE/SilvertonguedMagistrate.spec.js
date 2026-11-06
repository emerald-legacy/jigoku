describe('Silver-Tongued Magistrate', function () {
    integration(function () {
        describe('when attacking', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            'silver-tongued-magistrate',
                            { card: 'adept-of-shadows', fate: 1 },
                            'wandering-ronin'
                        ]
                    },
                    player2: {
                        inPlay: ['doji-whisperer', { card: 'doji-challenger', fate: 1 }]
                    }
                });
                this.magistrate = this.player1.findCardByName('silver-tongued-magistrate');
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.noMoreActions();
            });

            it('should stop each other character without fate from counting its skill', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.magistrate, this.adept, this.ronin],
                    defenders: [this.whisperer, this.challenger]
                });
                // magistrate (no fate, but itself) and adept (1 fate) count; ronin and whisperer are ignored
                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });

            it('should have no effect while it is not participating', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.ronin],
                    defenders: [this.whisperer, this.challenger]
                });
                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(6);
            });
        });

        describe('when defending', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['wandering-ronin']
                    },
                    player2: {
                        inPlay: ['silver-tongued-magistrate', 'doji-whisperer']
                    }
                });
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.magistrate = this.player2.findCardByName('silver-tongued-magistrate');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('should have no effect', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ronin],
                    defenders: [this.magistrate, this.whisperer]
                });
                expect(this.game.currentConflict.attackerSkill).toBe(2);
                expect(this.game.currentConflict.defenderSkill).toBe(5);
            });
        });
    });
});
