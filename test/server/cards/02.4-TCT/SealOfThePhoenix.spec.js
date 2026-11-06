describe('Seal of the Phoenix', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    hand: ['seal-of-the-phoenix']
                },
                player2: {
                    hand: ['let-go']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.seal = this.player1.findCardByName('seal-of-the-phoenix');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('gives the attached character the phoenix clan and the Scholar trait', function() {
            expect(this.whisperer.isFaction('phoenix')).toBe(false);
            expect(this.whisperer.hasTrait('scholar')).toBe(false);
            this.player1.playAttachment(this.seal, this.whisperer);
            expect(this.seal.parent).toBe(this.whisperer);
            expect(this.whisperer.isFaction('phoenix')).toBe(true);
            expect(this.whisperer.isFaction('crane')).toBe(true);
            expect(this.whisperer.hasTrait('scholar')).toBe(true);
            expect(this.whisperer.hasTrait('courtier')).toBe(true);
        });

        it('gives the attached character +1 political skill', function() {
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(3);
            this.player1.playAttachment(this.seal, this.whisperer);
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(4);
        });

        it('stops when the attachment leaves play', function() {
            this.player1.playAttachment(this.seal, this.whisperer);
            expect(this.whisperer.isFaction('phoenix')).toBe(true);
            expect(this.whisperer.hasTrait('scholar')).toBe(true);
            expect(this.whisperer.politicalSkill).toBe(4);
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.seal);
            expect(this.seal.location).toBe('conflict discard pile');
            expect(this.whisperer.isFaction('phoenix')).toBe(false);
            expect(this.whisperer.hasTrait('scholar')).toBe(false);
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(3);
        });
    });
});
