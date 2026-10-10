describe('Shrine Maiden', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['shrine-maiden'],
                    conflictDiscard: ['against-the-waves', 'centered-breath', 'fine-katana', 'banzai', 'let-go']
                }
            });

            this.maiden = this.player1.findCardByName('shrine-maiden');

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.letGo = this.player1.moveCard('let-go', 'conflict deck');
        });

        it('should add the revealed spells and kiho to the hand and discard the rest', function() {
            this.katana = this.player1.moveCard('fine-katana', 'conflict deck');
            this.breath = this.player1.moveCard('centered-breath', 'conflict deck');
            this.waves = this.player1.moveCard('against-the-waves', 'conflict deck');

            this.player1.clickCard(this.maiden);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.maiden);

            expect(this.waves.location).toBe('hand');
            expect(this.breath.location).toBe('hand');
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.letGo.location).toBe('conflict deck');
            expect(this.getChatLogs(5)).toContain('player1 uses Shrine Maiden, revealing Against the Waves, Centered Breath and Fine Katana to add Against the Waves and Centered Breath to their hand and discard Fine Katana');
        });

        it('should discard everything when nothing is a spell or kiho', function() {
            this.katana = this.player1.moveCard('fine-katana', 'conflict deck');
            this.banzai = this.player1.moveCard('banzai', 'conflict deck');

            this.player1.clickCard(this.maiden);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.maiden);

            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.letGo.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Shrine Maiden, revealing Banzai!, Fine Katana and Let Go to discard Banzai!, Fine Katana and Let Go');
        });

        it('should add everything when all are spells or kiho', function() {
            this.player1.moveCard(this.letGo, 'conflict discard pile');
            this.breath = this.player1.moveCard('centered-breath', 'conflict deck');
            this.waves = this.player1.moveCard('against-the-waves', 'conflict deck');

            this.player1.clickCard(this.maiden);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.maiden);

            expect(this.waves.location).toBe('hand');
            expect(this.breath.location).toBe('hand');
            expect(this.getChatLogs(5)).toContain('player1 uses Shrine Maiden, revealing Against the Waves and Centered Breath to add Against the Waves and Centered Breath to their hand');
        });
    });
});
