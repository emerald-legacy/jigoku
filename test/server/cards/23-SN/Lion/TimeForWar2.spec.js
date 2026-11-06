describe('Time For War 2', function () {
    integration(function () {
        describe('Time For War 2\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'doji-whisperer'],
                        hand: ['kamayari', 'time-for-war-evolved', 'cloud-the-mind'],
                        conflictDiscard: ['fine-katana']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('should trigger after losing a conflict', function () {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('time-for-war-evolved');
                this.player2.clickCard('time-for-war-evolved');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect('matsu-berserker');
                expect(this.player2).not.toBeAbleToSelect('doji-whisperer');
                this.matsuBerserker = this.player2.clickCard('matsu-berserker');
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).toBeAbleToSelect('kamayari');
                expect(this.player2).toBeAbleToSelect('cloud-the-mind');
                this.kamayari = this.player2.clickCard('kamayari');
                expect(this.matsuBerserker.attachments).toContain(this.kamayari);
                expect(this.getChatLogs(5)).toContain('player2 plays Time for War to attach an attachment to Matsu Berserker');
                expect(this.getChatLogs(5)).toContain('player2 chooses to attach Kamayari to Matsu Berserker');
            });

            it('should put an attachment into play from the conflict discard pile', function () {
                this.noMoreActions();
                this.player2.clickCard('time-for-war-evolved');
                this.matsuBerserker = this.player2.clickCard('matsu-berserker');
                expect(this.player2).toBeAbleToSelect('fine-katana');
                this.katana = this.player2.clickCard('fine-katana');
                expect(this.katana.location).toBe('play area');
                expect(this.matsuBerserker.attachments).toContain(this.katana);
            });
        });

        describe('Time For War 2 after winning', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['kamayari', 'time-for-war-evolved']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['doji-whisperer'],
                    defenders: ['matsu-berserker']
                });
            });

            it('should not trigger', function () {
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 0');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2.findCardByName('time-for-war-evolved').location).toBe('hand');
            });
        });
    });
});
