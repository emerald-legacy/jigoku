describe('Ignoble Enforcers', function() {
    integration(function() {
        describe('Ignoble Enforcers\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        honor: 10,
                        dynastyDiscard: ['ignoble-enforcers']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.ignobleEnforcers = this.player1.placeCardInProvince('ignoble-enforcers');
            });

            it('should trigger when Ignoble Enforcers is played', function() {
                this.player1.clickCard(this.ignobleEnforcers);
                this.player1.clickPrompt('1');
                expect(this.ignobleEnforcers.location).toBe('play area');
                expect(this.ignobleEnforcers.fate).toBe(1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ignobleEnforcers);
                this.player1.clickCard(this.ignobleEnforcers);
                expect(this.player1).toHavePrompt('Ignoble Enforcers');
                expect(this.player1).not.toHavePromptButton('0');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).toHavePromptButton('Cancel');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ignobleEnforcers);
                this.player1.clickCard(this.ignobleEnforcers);
                this.player1.clickPrompt('2');
                expect(this.player1.honor).toBe(8);
                expect(this.ignobleEnforcers.fate).toBe(3);
            });
        });
    });
});

describe('Ignoble Enforcers put into play by a card effect', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['matsu-berserker'],
                    hand: ['charge'],
                    dynastyDiscard: ['ignoble-enforcers']
                }
            });
            this.ignobleEnforcers = this.player1.placeCardInProvince('ignoble-enforcers');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: ['matsu-berserker'],
                defenders: []
            });
            this.player2.pass();
        });

        it('does not trigger (ruling #472)', function() {
            this.player1.clickCard('charge', 'hand');
            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.ignobleEnforcers);
            expect(this.ignobleEnforcers.location).toBe('play area');
            expect(this.ignobleEnforcers.isParticipating()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.ignobleEnforcers.fate).toBe(0);
            expect(this.player1.honor).toBe(10);
        });
    });
});
