describe('Kakita Mio', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-mio', 'kakita-yoshi', 'doji-whisperer', 'seppun-guardsman']
                },
                player2: {
                    inPlay: ['doji-challenger', 'matsu-berserker']
                }
            });
            this.mio = this.player1.findCardByName('kakita-mio');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.guardsman = this.player1.findCardByName('seppun-guardsman');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.berserker = this.player2.findCardByName('matsu-berserker');
        });

        it('should give Corrupt to a character participating alone, even from home, and boost participating Imperial characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi, this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            expect(this.yoshi.militarySkill).toBe(2);
            expect(this.yoshi.politicalSkill).toBe(6);
            this.player1.clickCard(this.mio);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.hasTrait('shadowlands')).toBe(true);
            expect(this.yoshi.militarySkill).toBe(3);
            expect(this.yoshi.politicalSkill).toBe(7);
            expect(this.whisperer.politicalSkill).toBe(3);
            expect(this.mio.politicalSkill).toBe(3);
        });

        it('should remove Corrupt at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi, this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.mio);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.hasTrait('shadowlands')).toBe(true);
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.challenger.hasTrait('shadowlands')).toBe(false);
        });

        it('should not boost Imperial characters when no opposing participant is Corrupt or tainted', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardsman],
                defenders: [this.challenger]
            });
            expect(this.guardsman.militarySkill).toBe(2);
            this.player2.pass();
            this.player1.clickCard(this.mio);
            expect(this.player1).toBeAbleToSelect(this.guardsman);
            this.player1.clickCard(this.guardsman);
            expect(this.guardsman.hasTrait('shadowlands')).toBe(true);
            expect(this.guardsman.militarySkill).toBe(2);
        });
    });
});
