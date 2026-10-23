describe('Herald of Justice', function () {
    integration(function () {
        describe('during the conflict phase', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['herald-of-justice', 'doji-whisperer']
                    },
                    player2: {
                        inPlay: ['matsu-berserker']
                    }
                });
                this.herald = this.player1.findCardByName('herald-of-justice');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.berserker = this.player2.findCardByName('matsu-berserker');
            });

            it('sacrifices a friendly character to allow an additional military conflict', function () {
                expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);

                this.player1.clickCard(this.herald);
                expect(this.player1).toHavePrompt('Select card to sacrifice');
                expect(this.player1).toBeAbleToSelect(this.herald);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.berserker);

                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.location).toBe('dynasty discard pile');
                expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
                expect(this.player1.player.getConflictOpportunities()).toBe(3);
                expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 uses Herald of Justice, sacrificing Doji Whisperer to allow player1 to declare an additional military conflict this phase');
            });

            it('can sacrifice itself', function () {
                this.player1.clickCard(this.herald);
                this.player1.clickCard(this.herald);
                expect(this.herald.location).toBe('dynasty discard pile');
                expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            });

            it('lets you declare two military conflicts', function () {
                this.player1.clickCard(this.herald);
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.herald],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            });
        });

        describe('under Waning Hostilities', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['herald-of-justice', 'doji-whisperer'],
                        hand: ['waning-hostilities']
                    }
                });
                this.herald = this.player1.findCardByName('herald-of-justice');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.player1.clickCard('waning-hostilities');
            });

            it('cannot be used, as an additional conflict changes nothing', function () {
                expect(this.player1).toHavePrompt('Initiate an action');
                this.player1.clickCard(this.herald);
                expect(this.player1).toHavePrompt('Initiate an action');
                expect(this.herald.location).toBe('play area');
            });
        });

        describe('outside the conflict phase', function () {
            it('cannot be used during the dynasty phase', function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['herald-of-justice', 'doji-whisperer']
                    }
                });
                this.herald = this.player1.findCardByName('herald-of-justice');

                expect(this.player1).toHavePrompt('Click pass when done');
                this.player1.clickCard(this.herald);
                expect(this.player1).toHavePrompt('Click pass when done');
            });

            it('cannot be used during the fate phase', function () {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['herald-of-justice', 'doji-whisperer']
                    }
                });
                this.herald = this.player1.findCardByName('herald-of-justice');

                expect(this.player1).toHavePrompt('Initiate an action');
                this.player1.clickCard(this.herald);
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });
    });
});
