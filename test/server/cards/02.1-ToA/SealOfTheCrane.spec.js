describe('Seal of the Crane', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso'],
                    hand: ['seal-of-the-crane']
                },
                player2: {
                    hand: ['let-go']
                }
            });
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.seal = this.player1.findCardByName('seal-of-the-crane');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('gives the attached character the crane clan and the Duelist trait', function() {
            expect(this.gunso.isFaction('crane')).toBe(false);
            expect(this.gunso.hasTrait('duelist')).toBe(false);
            this.player1.playAttachment(this.seal, this.gunso);
            expect(this.seal.parent).toBe(this.gunso);
            expect(this.gunso.isFaction('crane')).toBe(true);
            expect(this.gunso.isFaction('lion')).toBe(true);
            expect(this.gunso.hasTrait('duelist')).toBe(true);
            expect(this.gunso.hasTrait('bushi')).toBe(true);
        });

        it('gives the attached character +1 political skill', function() {
            expect(this.gunso.militarySkill).toBe(2);
            expect(this.gunso.politicalSkill).toBe(1);
            this.player1.playAttachment(this.seal, this.gunso);
            expect(this.gunso.militarySkill).toBe(2);
            expect(this.gunso.politicalSkill).toBe(2);
        });

        it('stops when the attachment leaves play', function() {
            this.player1.playAttachment(this.seal, this.gunso);
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.seal);
            expect(this.seal.location).toBe('conflict discard pile');
            expect(this.gunso.isFaction('crane')).toBe(false);
            expect(this.gunso.hasTrait('duelist')).toBe(false);
            expect(this.gunso.militarySkill).toBe(2);
            expect(this.gunso.politicalSkill).toBe(1);
        });
    });
});
