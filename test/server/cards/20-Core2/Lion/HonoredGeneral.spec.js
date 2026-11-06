describe('Honored General', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['honored-general', 'matsu-berserker', 'doji-whisperer', 'ikoma-prodigy']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.general = this.player1.findCardByName('honored-general');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.prodigy = this.player1.findCardByName('ikoma-prodigy');
            this.opponentsBerserker = this.player2.findCardByName('matsu-berserker');
        });

        it('gives +1 military to each other participating Lion character you control', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.general, this.berserker, this.whisperer],
                defenders: [this.opponentsBerserker]
            });

            expect(this.berserker.getMilitarySkill()).toBe(4);
            expect(this.general.getMilitarySkill()).toBe(3);
            expect(this.whisperer.getMilitarySkill()).toBe(0);
            expect(this.prodigy.getMilitarySkill()).toBe(0);
            expect(this.opponentsBerserker.getMilitarySkill()).toBe(3);
            expect(this.getChatLogs(3)).toContain('Military Air conflict - Attacker: 7 Defender: 3');
        });

        it('gives no bonus while it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.opponentsBerserker]
            });

            expect(this.general.isParticipating()).toBe(false);
            expect(this.berserker.getMilitarySkill()).toBe(3);
        });
    });
});

describe('Honored General entering play', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['honored-general']
                }
            });
            this.general = this.player1.placeCardInProvince('honored-general', 'province 1');
        });

        it('honors itself after it enters play', function() {
            this.player1.clickCard(this.general);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.general);

            expect(this.general.isHonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Honored General to honor Honored General');
        });
    });
});
