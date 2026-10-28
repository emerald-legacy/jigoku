describe('Implacable Magistrate', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['implacable-magistrate', 'brash-samurai', { card: 'matsu-berserker', honor: 'honored' }],
                    hand: ['admit-defeat']
                },
                player2: {
                    inPlay: ['doji-challenger', { card: 'kakita-kaezin', honor: 'honored' }]
                }
            });
            this.magistrate = this.player1.findCardByName('implacable-magistrate');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.kaezin = this.player2.findCardByName('kakita-kaezin');
            this.noMoreActions();
        });

        it('while attacking, only it and honored characters count their skill', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.magistrate, this.brash, this.berserker],
                defenders: [this.challenger, this.kaezin]
            });
            expect(this.game.currentConflict.attackerSkill).toBe(6);
            expect(this.game.currentConflict.defenderSkill).toBe(5);
            expect(this.brash.isParticipating()).toBe(true);
            expect(this.challenger.isParticipating()).toBe(true);
        });

        // ruling #277: it never makes an honored character count when it would not normally
        it('does not make a bowed honored character count its skill', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.magistrate],
                defenders: [this.kaezin]
            });
            expect(this.game.currentConflict.defenderSkill).toBe(5);
            this.player2.pass();
            this.player1.clickCard('admit-defeat');
            this.player1.clickCard(this.kaezin);
            expect(this.kaezin.bowed).toBe(true);
            expect(this.kaezin.isParticipating()).toBe(true);
            expect(this.game.currentConflict.defenderSkill).toBe(0);
        });

        it('does not affect skill while it is defending', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger, this.kaezin],
                defenders: [this.magistrate, this.brash]
            });
            expect(this.game.currentConflict.attackerSkill).toBe(8);
            expect(this.game.currentConflict.defenderSkill).toBe(4);
        });

        it('does not affect skill while it is not participating', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash, this.berserker],
                defenders: [this.challenger, this.kaezin]
            });
            expect(this.magistrate.isParticipating()).toBe(false);
            expect(this.game.currentConflict.attackerSkill).toBe(6);
            expect(this.game.currentConflict.defenderSkill).toBe(8);
        });
    });
});
