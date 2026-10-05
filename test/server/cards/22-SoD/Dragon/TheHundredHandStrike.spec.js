describe('The Hundred Hand Strike', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['the-hundred-hand-strike']
                },
                player2: {
                    inPlay: ['togashi-yokuni']
                }
            });

            this.monk = this.player1.findCardByName('tattooed-wanderer');
            this.strike = this.player1.findCardByName('the-hundred-hand-strike');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('discards a character with no fate that no longer contributes skill', function () {
            this.game.rings.fire.fate = 1;
            this.game.rings.void.fate = 1;
            this.yokuni.fate = 0;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.monk],
                defenders: [this.yokuni]
            });

            this.player2.pass();
            this.player1.clickCard(this.strike);
            this.player1.clickCard(this.monk);
            this.player1.clickCard(this.yokuni);

            expect(this.yokuni.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('Togashi Yokuni is injured because it is not contributing skill to the current conflict');
        });
    });
});
