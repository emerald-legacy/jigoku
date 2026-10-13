describe('Miwaku Kabe', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-toshimoko', 'doji-challenger']
                },
                player2: {
                    dynastyDiscard: ['miwaku-kabe']
                }
            });
            this.kabe = this.player2.placeCardInProvince('miwaku-kabe', 'province 1');
            this.province = this.player2.findCardByName('shameful-display', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.province,
                attackers: ['kakita-toshimoko', 'doji-challenger'],
                defenders: []
            });
            this.noMoreActions();
        });

        it('shuffles itself into the dynasty deck when its province is broken', function() {
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.kabe);
            expect(this.kabe.location).toBe('dynasty deck');
            expect(this.province.isBroken).toBe(true);
            expect(this.player1).not.toHavePrompt('Do you wish to discard Miwaku Kabe?');
            expect(this.getChatLogs(5)).toContain('player2 uses Miwaku Kabe to shuffle itself back into the dynasty deck');
        });
    });
});
