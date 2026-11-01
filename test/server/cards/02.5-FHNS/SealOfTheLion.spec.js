describe('Seal of the Lion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    hand: ['seal-of-the-lion']
                },
                player2: {
                    hand: ['let-go']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.seal = this.player1.findCardByName('seal-of-the-lion');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('gives the attached character the lion clan and the Commander trait', function() {
            expect(this.whisperer.isFaction('lion')).toBe(false);
            expect(this.whisperer.hasTrait('commander')).toBe(false);
            this.player1.playAttachment(this.seal, this.whisperer);
            expect(this.seal.parent).toBe(this.whisperer);
            expect(this.whisperer.isFaction('lion')).toBe(true);
            expect(this.whisperer.isFaction('crane')).toBe(true);
            expect(this.whisperer.hasTrait('commander')).toBe(true);
            expect(this.whisperer.hasTrait('courtier')).toBe(true);
        });

        it('gives the attached character +1 military skill', function() {
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(3);
            this.player1.playAttachment(this.seal, this.whisperer);
            expect(this.whisperer.militarySkill).toBe(1);
            expect(this.whisperer.politicalSkill).toBe(3);
        });

        it('stops when the attachment leaves play', function() {
            this.player1.playAttachment(this.seal, this.whisperer);
            expect(this.whisperer.isFaction('lion')).toBe(true);
            expect(this.whisperer.hasTrait('commander')).toBe(true);
            expect(this.whisperer.militarySkill).toBe(1);
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.seal);
            expect(this.seal.location).toBe('conflict discard pile');
            expect(this.whisperer.isFaction('lion')).toBe(false);
            expect(this.whisperer.hasTrait('commander')).toBe(false);
            expect(this.whisperer.militarySkill).toBe(0);
            expect(this.whisperer.politicalSkill).toBe(3);
        });
    });
});
