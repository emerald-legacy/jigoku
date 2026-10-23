describe('Shinjo Altansarnai', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-altansarnai', 'akodo-toturi'],
                    hand: ['raze-to-the-ground'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'doji-whisperer'],
                    provinces: ['entrenched-position']
                }
            });
            this.shinjo = this.player1.findCardByName('shinjo-altansarnai');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.garden.facedown = false;
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.entrenched = this.player2.findCardByName('entrenched-position');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.entrenched,
                attackers: [this.shinjo, 'akodo-toturi'],
                defenders: [this.raitsugu]
            });
            this.noMoreActions();
        });

        it('reacts to the province you broke, not to your own province your opponent broke', function() {
            this.player1.clickCard('raze-to-the-ground');
            this.player1.clickCard(this.shinjo);
            this.player1.clickCard(this.garden);
            expect(this.player2).toHavePrompt('Break Manicured Garden');
            this.player2.clickPrompt('No');
            expect(this.player1).toHavePrompt('Break Entrenched Position');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.shinjo);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('dynasty discard pile');
        });
    });
});
