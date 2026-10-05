describe('Ikoma Yumiko\'s Dagger', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ancient-master', 'doji-challenger']
                },
                player2: {
                    inPlay: ['ikoma-natsuko', 'ikoma-yumiko-s-dagger']
                }
            });

            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.natsuko = this.player2.findCardByName('ikoma-natsuko');
            this.dagger = this.player2.findCardByName('ikoma-yumiko-s-dagger');
        });

        it('removes a fate from both characters when they have fate', function () {
            this.ancientMaster.fate = 2;
            this.dagger.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ancientMaster, this.challenger],
                defenders: [this.natsuko, this.dagger]
            });

            this.player2.clickCard(this.dagger);
            this.player2.clickCard(this.ancientMaster);
            expect(this.ancientMaster.location).toBe('play area');
            expect(this.ancientMaster.fate).toBe(1);
            expect(this.dagger.location).toBe('play area');
            expect(this.dagger.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player2 uses Ikoma Yumiko\'s Dagger to injure itself and Ancient Master');
        });
    });
});
