describe('Steel on Steel', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mirumoto-rei-2', 'daidoji-uji'],
                    hand: ['steel-on-steel', 'two-hands']
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'doji-diplomat']
                },
                gameMode: 'emerald'
            });

            this.rei = this.player1.findCardByName('mirumoto-rei-2');
            this.uji = this.player1.findCardByName('daidoji-uji');
            this.steelOnSteel = this.player1.findCardByName('steel-on-steel');
            this.hands = this.player1.findCardByName('two-hands');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.diplomat = this.player2.findCardByName('doji-diplomat');

            this.toshimoko.fate = 2;

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rei, this.uji],
                defenders: [this.diplomat, this.toshimoko]
            });
            this.player2.pass();
        });

        it('injures the loser', function () {
            this.player1.clickCard(this.steelOnSteel);
            this.player1.clickCard(this.rei);
            this.player1.clickCard(this.diplomat);
            this.player1.clickPrompt('Pass');
            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');

            expect(this.diplomat.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(10)).toContain('Duel Effect: injure Doji Diplomat');
        });

        it('injures every loser of the duel', function () {
            this.player1.clickCard(this.steelOnSteel);
            this.player1.clickCard(this.rei);
            this.player1.clickCard(this.toshimoko);
            this.player1.clickCard(this.hands);
            this.player1.clickCard(this.diplomat);
            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');

            expect(this.toshimoko.location).toBe('play area');
            expect(this.toshimoko.fate).toBe(1);
            expect(this.diplomat.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(10)).toContain('Duel Effect: injure Kakita Toshimoko and Doji Diplomat');
        });
    });
});
