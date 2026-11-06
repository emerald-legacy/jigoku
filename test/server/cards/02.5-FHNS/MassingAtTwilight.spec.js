describe('Massing at Twilight', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-challenger', attachments: ['fine-katana'] }, 'adept-of-shadows']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    provinces: ['massing-at-twilight']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.adept = this.player1.findCardByName('adept-of-shadows');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.massing = this.player2.findCardByName('massing-at-twilight', 'province 1');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
        });

        it('should count combined military and political skill in a military conflict at this province', function () {
            this.initiateConflict({
                type: 'military',
                province: this.massing,
                attackers: [this.challenger, this.adept],
                defenders: [this.whisperer]
            });
            // challenger 5 (with Fine Katana) + 3, adept 2 + 2
            expect(this.game.currentConflict.attackerSkill).toBe(12);
            expect(this.game.currentConflict.defenderSkill).toBe(3);
        });

        it('should count combined military and political skill in a political conflict at this province', function () {
            this.initiateConflict({
                type: 'political',
                province: this.massing,
                attackers: [this.challenger, this.adept],
                defenders: [this.whisperer]
            });
            expect(this.game.currentConflict.attackerSkill).toBe(12);
            expect(this.game.currentConflict.defenderSkill).toBe(3);
        });

        it('should have no effect on conflicts at another province', function () {
            this.initiateConflict({
                type: 'military',
                province: this.otherProvince,
                attackers: [this.challenger, this.adept],
                defenders: [this.whisperer]
            });
            expect(this.game.currentConflict.attackerSkill).toBe(7);
            expect(this.game.currentConflict.defenderSkill).toBe(0);
        });
    });
});
