describe('Blood of Onnotangu', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-challenger', attachments: ['scarlet-sabre'] }]
                },
                player2: {
                    provinces: ['blood-of-onnotangu']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.blood = this.player2.findCardByName('blood-of-onnotangu');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.blood,
                attackers: [this.challenger],
                defenders: []
            });
        });

        it('doesn\'t stop a player from losing fate, only from spending it (EmeraldDB ruling)', function () {
            const fate = this.player2.fate;
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.challenger);
            expect(this.player2.fate).toBe(fate - 1);
        });
    });
});
