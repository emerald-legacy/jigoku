describe('Sake House Confidant', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['sake-house-confidant', 'shosuro-sadako', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['shosuro-sadako']
                }
            });
            this.confidant = this.player1.findCardByName('sake-house-confidant');
            this.sadako = this.player1.findCardByName('shosuro-sadako');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.enemySadako = this.player2.findCardByName('shosuro-sadako');
            this.player1.player.imperialFavor = 'political';
            this.noMoreActions();
        });

        it('should discard the Imperial Favor to give each Shinobi you control +2 political', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.confidant],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.confidant);
            expect(this.player1.player.imperialFavor).toBe('');
            expect(this.confidant.politicalSkill).toBe(3);
            expect(this.sadako.politicalSkill).toBe(3);
            expect(this.whisperer.politicalSkill).toBe(3);
            expect(this.enemySadako.politicalSkill).toBe(1);
            expect(this.confidant.militarySkill).toBe(1);
            expect(this.getChatLogs(3)).toContain('player1 uses Sake House Confidant, discarding the Imperial Favor to give their Shinobi +0/+2');
        });

        it('should not be usable without the Imperial Favor', function() {
            this.player1.player.imperialFavor = '';
            this.initiateConflict({
                type: 'political',
                attackers: [this.confidant],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.confidant);
            expect(this.confidant.politicalSkill).toBe(1);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not be usable while it is not participating', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.confidant);
            expect(this.player1.player.imperialFavor).toBe('political');
            expect(this.sadako.politicalSkill).toBe(1);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
