describe('Grizzled Strategist', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['grizzled-strategist', 'matsu-berserker', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['banzai', 'way-of-the-scorpion']
                }
            });
            this.strategist = this.player1.findCardByName('grizzled-strategist');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.banzai = this.player2.findCardByName('banzai');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
        });

        it('should sacrifice a character to cancel an event played during a conflict it participates in', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.strategist, this.berserker],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.strategist);
            this.player1.clickCard(this.strategist);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.challenger.militarySkill).toBe(3);
            expect(this.banzai.location).toBe('conflict discard pile');
        });

        it('should not trigger when it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.challenger);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.challenger.militarySkill).toBe(5);
        });

        it('should not be able to be dishonored', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.strategist, this.berserker],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.wayOfTheScorpion);
            expect(this.player2).toHavePrompt('Way of the Scorpion');
            expect(this.player2).not.toBeAbleToSelect(this.strategist);
            expect(this.player2).toBeAbleToSelect(this.berserker);
        });
    });
});
