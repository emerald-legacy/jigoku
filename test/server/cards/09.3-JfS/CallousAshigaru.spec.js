

describe('Callous Ashigaru when Raze to the Ground breaks its player\'s own province', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'akodo-toturi'],
                    hand: ['raze-to-the-ground', 'callous-ashigaru'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    provinces: ['entrenched-position']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.callousAshigaru = this.player1.findCardByName('callous-ashigaru');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.garden.facedown = false;
            this.player1.playAttachment(this.callousAshigaru, this.toturi);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.player2.findCardByName('entrenched-position'),
                attackers: [this.challenger, this.toturi],
                defenders: ['mirumoto-raitsugu']
            });
            this.noMoreActions();
            this.player1.clickCard('raze-to-the-ground');
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.garden);
        });

        it('reacts only to the province its player broke', function() {
            expect(this.player2).toHavePrompt('Break Manicured Garden');
            this.player2.clickPrompt('No');
            expect(this.player1).toHavePrompt('Break Entrenched Position');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.callousAshigaru);
        });
    });
});
