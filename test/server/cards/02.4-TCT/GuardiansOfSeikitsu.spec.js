describe('Guardians of the Seikitsu', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso', 'doji-challenger', 'matsu-berserker']
                },
                player2: {
                    role: 'keeper-of-earth',
                    inPlay: ['doji-whisperer', 'kakita-yoshi'],
                    provinces: ['guardians-of-the-seikitsu']
                }
            });
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.guardians = this.player2.findCardByName('guardians-of-the-seikitsu');
        });

        it('should bow each character with printed cost 2 or lower when revealed', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.guardians,
                attackers: [this.gunso, this.challenger]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.guardians);
            this.player2.clickCard(this.guardians);
            expect(this.gunso.bowed).toBe(true);
            expect(this.berserker.bowed).toBe(true);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.challenger.bowed).toBe(false);
            expect(this.yoshi.bowed).toBe(false);
        });

        it('should not trigger when the province is already faceup', function() {
            this.guardians.facedown = false;
            this.game.checkGameState(true);
            this.noMoreActions();
            this.initiateConflict({
                province: this.guardians,
                attackers: [this.gunso, this.challenger]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.gunso.bowed).toBe(false);
            expect(this.whisperer.bowed).toBe(false);
        });
    });
});
