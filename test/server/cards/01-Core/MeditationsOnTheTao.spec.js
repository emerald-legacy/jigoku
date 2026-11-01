describe('Meditations on the Tao', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'brash-samurai', fate: 2 }, { card: 'matsu-berserker', fate: 1 }]
                },
                player2: {
                    inPlay: [{ card: 'doji-whisperer', fate: 1 }],
                    provinces: ['meditations-on-the-tao']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.meditations = this.player2.findCardByName('meditations-on-the-tao');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('removes 1 fate from an attacking character during a conflict at this province', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.meditations,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            this.player2.clickCard(this.meditations);
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.berserker);
            this.player2.clickCard(this.brash);
            expect(this.brash.fate).toBe(1);
            expect(this.whisperer.fate).toBe(1);
            expect(this.berserker.fate).toBe(1);
        });

        it('cannot be used during a conflict at another province', function() {
            this.meditations.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.otherProvince,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.meditations);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2).not.toBeAbleToSelect(this.brash);
            expect(this.brash.fate).toBe(2);
        });
    });
});
