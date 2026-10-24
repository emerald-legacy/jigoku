describe('Wings of the Phoenix', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['wings-of-the-phoenix'],
                    inPlay: ['solemn-scholar', 'adept-of-the-waves', 'fire-tensai-initiate']
                },
                player2: {
                    inPlay: ['brash-samurai', 'doji-whisperer']
                }
            });

            this.wings = this.player1.findCardByName('wings-of-the-phoenix');
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.tensai = this.player1.findCardByName('fire-tensai-initiate');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('moves a character home and, with fire affinity, gives each enemy participant -1/-1', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scholar, this.adept],
                defenders: [this.brash, this.whisperer],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.wings);
            this.player1.clickCard(this.scholar);
            expect(this.scholar.isParticipating()).toBe(false);
            expect(this.brash.getMilitarySkill()).toBe(1);
            expect(this.brash.getPoliticalSkill()).toBe(0);
            expect(this.whisperer.getPoliticalSkill()).toBe(2);
            expect(this.getChatLogs(5)).toContain('player1 channels their fire affinity to give all participating enemies -1military/-1political until the end of the conflict');
        });

        it('moves a character to the conflict without the penalty when there is no fire affinity', function () {
            this.player1.moveCard(this.tensai, 'dynasty discard pile');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept],
                defenders: [this.brash],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.wings);
            this.player1.clickCard(this.scholar);
            expect(this.scholar.isParticipating()).toBe(true);
            expect(this.brash.getMilitarySkill()).toBe(2);
        });
    });
});
