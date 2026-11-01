describe('Manicured Garden', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    fate: 3,
                    inPlay: ['doji-whisperer'],
                    provinces: ['manicured-garden']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.manicuredGarden = this.player2.findCardByName('manicured-garden');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('gains 1 fate during a conflict at this province', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.manicuredGarden,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            this.player2.clickCard(this.manicuredGarden);
            expect(this.player2.fate).toBe(4);
        });

        it('cannot be used during a conflict at another province', function() {
            this.manicuredGarden.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.otherProvince,
                attackers: [this.brash],
                defenders: [this.whisperer]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.manicuredGarden);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.fate).toBe(3);
        });

        it('cannot be used outside a conflict', function() {
            this.manicuredGarden.facedown = false;
            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.manicuredGarden);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.player2.fate).toBe(3);
        });
    });
});
