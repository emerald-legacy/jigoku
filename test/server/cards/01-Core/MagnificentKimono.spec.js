describe('Magnificent Kimono', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'doji-whisperer', attachments: ['magnificent-kimono'] },
                        'valiant-oathkeeper'
                    ]
                },
                player2: {
                    inPlay: ['attendant-to-the-emperor', 'wild-ogre']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.kimono = this.player1.findCardByName('magnificent-kimono');
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
            this.ogre = this.player2.findCardByName('wild-ogre');
            this.noMoreActions();
        });

        it('gives the attached character Pride: it is honored after it wins a conflict', function() {
            expect(this.whisperer.hasPride()).toBe(true);
            expect(this.oathkeeper.hasPride()).toBe(false);
            this.initiateConflict({
                type: 'political',
                ring: 'earth',
                attackers: [this.whisperer, this.oathkeeper],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a political conflict 6 vs 0');
            expect(this.getChatLogs(10)).toContain('Doji Whisperer is honored due to their Pride');
            expect(this.whisperer.isHonored).toBe(true);
            expect(this.oathkeeper.isHonored).toBe(false);
        });

        it('gives the attached character Pride: it is dishonored after it loses a conflict', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'earth',
                attackers: [this.whisperer, this.oathkeeper],
                defenders: [this.attendant, this.ogre]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a political conflict 9 vs 6');
            expect(this.getChatLogs(10)).toContain('Doji Whisperer is dishonored due to their Pride');
            expect(this.whisperer.isDishonored).toBe(true);
            expect(this.oathkeeper.isDishonored).toBe(false);
        });
    });
});
