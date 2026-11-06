describe('Seal of the Scorpion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso'],
                    hand: ['seal-of-the-scorpion']
                },
                player2: {
                    hand: ['let-go']
                }
            });
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.seal = this.player1.findCardByName('seal-of-the-scorpion');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('should give the attached character the scorpion clan and the Shinobi trait', function() {
            expect(this.gunso.isFaction('scorpion')).toBe(false);
            expect(this.gunso.hasTrait('shinobi')).toBe(false);
            this.player1.playAttachment(this.seal, this.gunso);
            expect(this.gunso.attachments).toContain(this.seal);
            expect(this.gunso.isFaction('scorpion')).toBe(true);
            expect(this.gunso.isFaction('lion')).toBe(true);
            expect(this.gunso.hasTrait('shinobi')).toBe(true);
            expect(this.gunso.hasTrait('bushi')).toBe(true);
        });

        it('should stop when the attachment leaves play', function() {
            this.player1.playAttachment(this.seal, this.gunso);
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.seal);
            expect(this.seal.location).toBe('conflict discard pile');
            expect(this.gunso.isFaction('scorpion')).toBe(false);
            expect(this.gunso.hasTrait('shinobi')).toBe(false);
        });
    });
});
