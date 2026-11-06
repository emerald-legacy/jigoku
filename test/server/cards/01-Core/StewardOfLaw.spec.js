describe('Steward of Law', function() {
    integration(function() {
        describe('Steward of Law/Spies at court interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law'],
                        hand: ['spies-at-court', 'court-games']
                    },
                    player2: {
                        hand: ['banzai']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('shouldn\'t allow characters to become dishonored to pay the cost of Spies', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Earth Ring');
            });

            it('should allow honored characters to trigger Spies', function() {
                this.player2.pass();
                this.player1.clickCard('court-games');
                this.player1.clickPrompt('Honor a friendly character');
                this.stewardOfLaw = this.player1.clickCard('steward-of-law');
                expect(this.stewardOfLaw.isHonored).toBe(true);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('spies-at-court');
            });
        });

        describe('Steward of Law and The Art of Peace', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law', 'doji-challenger', 'matsu-berserker']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        provinces: {
                            'province 1': {
                                provinceCard: 'the-art-of-peace'
                            }
                        }
                    }
                });
                this.steward = this.player1.findCardByName('steward-of-law');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.artOfPeace = this.player2.findCardByName('the-art-of-peace');
                this.noMoreActions();
            });

            it('stops an effect from dishonoring characters while Steward of Law is participating', function() {
                this.initiateConflict({
                    attackers: [this.steward, this.challenger],
                    defenders: [this.whisperer],
                    province: this.artOfPeace
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.artOfPeace);
                expect(this.getChatLogs(3)).toContain('player2 uses The Art of Peace to dishonor all attackers and honor all defenders in this conflict');
                expect(this.artOfPeace.isBroken).toBe(true);
                expect(this.whisperer.isHonored).toBe(true);
                expect(this.challenger.isDishonored).toBe(false);
                expect(this.steward.isDishonored).toBe(false);
            });

            it('does not stop the dishonor while Steward of Law is not participating', function() {
                this.initiateConflict({
                    attackers: [this.challenger, this.berserker],
                    defenders: [this.whisperer],
                    province: this.artOfPeace
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.artOfPeace);
                expect(this.getChatLogs(3)).toContain('player2 uses The Art of Peace to dishonor all attackers and honor all defenders in this conflict');
                expect(this.steward.isParticipating()).toBe(false);
                expect(this.whisperer.isHonored).toBe(true);
                expect(this.challenger.isDishonored).toBe(true);
                expect(this.berserker.isDishonored).toBe(true);
            });
        });
    });
});
