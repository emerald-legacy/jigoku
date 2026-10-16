describe('Haughty Magistrate', function () {
    integration(function () {
        describe('when attacking', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['haughty-magistrate', 'adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger', 'wandering-ronin']
                    }
                });
                this.magistrate = this.player1.findCardByName('haughty-magistrate');
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.ronin = this.player2.findCardByName('wandering-ronin');
                this.noMoreActions();
            });

            it('should stop characters with lower glory from counting their skill', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.magistrate, this.adept],
                    defenders: [this.whisperer, this.challenger, this.ronin]
                });
                // glory 0: adept and ronin are ignored; whisperer (equal glory 1) and challenger (glory 2) count
                expect(this.game.currentConflict.attackerSkill).toBe(2);
                expect(this.game.currentConflict.defenderSkill).toBe(6);
            });

            it('should have no effect while it is not participating', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept],
                    defenders: [this.whisperer, this.ronin]
                });
                expect(this.game.currentConflict.attackerSkill).toBe(2);
                expect(this.game.currentConflict.defenderSkill).toBe(5);
            });
        });

        describe('when its glory is raised', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [{ card: 'haughty-magistrate', attachments: ['favor-of-the-kami'] }]
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger']
                    }
                });
                this.magistrate = this.player1.findCardByName('haughty-magistrate');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.noMoreActions();
            });

            it('should compare against its current glory', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.magistrate],
                    defenders: [this.whisperer, this.challenger]
                });
                // magistrate has glory 2: whisperer (glory 1) is ignored, challenger (glory 2) counts
                expect(this.game.currentConflict.attackerSkill).toBe(2);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });
        });

        describe('when defending', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['haughty-magistrate', 'wandering-ronin']
                    }
                });
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.magistrate = this.player2.findCardByName('haughty-magistrate');
                this.ronin = this.player2.findCardByName('wandering-ronin');
                this.noMoreActions();
            });

            it('should have no effect', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept],
                    defenders: [this.magistrate, this.ronin]
                });
                expect(this.game.currentConflict.attackerSkill).toBe(2);
                expect(this.game.currentConflict.defenderSkill).toBe(4);
            });
        });
    });
});
