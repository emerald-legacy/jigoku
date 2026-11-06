describe('Stoic Magistrate', function () {
    integration(function () {
        describe('when defending', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-shadows', 'doji-challenger']
                    },
                    player2: {
                        inPlay: ['stoic-magistrate', 'doji-whisperer']
                    }
                });
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.magistrate = this.player2.findCardByName('stoic-magistrate');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('should stop each character with printed cost 2 or lower from counting its skill', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.challenger],
                    defenders: [this.magistrate, this.whisperer]
                });
                // adept (cost 2) and whisperer (cost 1) are ignored; challenger and the magistrate (cost 3) count
                expect(this.game.currentConflict.attackerSkill).toBe(3);
                expect(this.game.currentConflict.defenderSkill).toBe(2);
            });

            it('should have no effect while it is not participating', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.challenger],
                    defenders: [this.whisperer]
                });
                expect(this.game.currentConflict.attackerSkill).toBe(5);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });
        });

        describe('when attacking', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['stoic-magistrate', 'adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.magistrate = this.player1.findCardByName('stoic-magistrate');
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('should have no effect', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.magistrate, this.adept],
                    defenders: [this.whisperer]
                });
                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });
        });
    });
});
