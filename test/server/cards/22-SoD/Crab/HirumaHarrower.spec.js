describe('Hiruma Harrower', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hiruma-harrower', 'yogo-norio', 'doji-whisperer', 'matsu-berserker']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['assassination']
                }
            });
            this.harrower = this.player1.findCardByName('hiruma-harrower');
            this.norio = this.player1.findCardByName('yogo-norio');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('should get +2 military each time a character leaves play during a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.harrower],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.harrower);
            this.player1.clickCard(this.harrower);
            expect(this.harrower.militarySkill).toBe(4);

            this.player1.clickCard(this.norio);
            this.player1.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.harrower);
            expect(this.harrower.militarySkill).toBe(6);
        });

        it('should not trigger when a character leaves play outside of a conflict', function() {
            this.player1.clickCard(this.norio);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.location).toBe('dynasty discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.harrower.militarySkill).toBe(2);
        });
    });
});

describe('Hiruma Harrower with characters removed from a discard pile', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hiruma-harrower'],
                    hand: ['armor-of-the-fallen'],
                    dynastyDiscard: ['kaiu-envoy', 'matsu-berserker']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.harrower = this.player1.findCardByName('hiruma-harrower');
            this.envoy = this.player1.findCardByName('kaiu-envoy');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.player1.playAttachment('armor-of-the-fallen', this.harrower);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.harrower],
                defenders: [this.whisperer]
            });
            this.player2.pass();
        });

        it('should not trigger for characters that were not in play', function() {
            const military = this.harrower.militarySkill;
            this.player1.clickCard(this.harrower);
            this.player1.clickCard(this.envoy);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.whisperer);
            expect(this.envoy.location).toBe('removed from game');
            expect(this.berserker.location).toBe('removed from game');
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.harrower.militarySkill).toBe(military);
        });
    });
});
