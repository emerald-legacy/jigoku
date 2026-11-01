describe('Time For War', function () {
    integration(function () {
        describe('Time For War\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['kamayari', 'time-for-war']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('should trigger after losing a political conflict', function () {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('time-for-war');
                this.player2.clickCard('time-for-war');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect('matsu-berserker');
                this.matsuBerserker = this.player2.clickCard('matsu-berserker');
                expect(this.player2).toHavePrompt('Choose a weapon attachment');
                expect(this.player2).toBeAbleToSelect('kamayari');
                this.kamayari = this.player2.clickCard('kamayari');
                expect(this.matsuBerserker.attachments).toContain(this.kamayari);
                expect(this.getChatLogs(5)).toContain('player2 plays Time for War to attach a weapon to Matsu Berserker');
                expect(this.getChatLogs(5)).toContain('player2 chooses to attach Kamayari to Matsu Berserker');
            });
        });

        describe('Time For War\'s targets', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law', 'doji-challenger']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'doji-whisperer'],
                        hand: ['time-for-war', 'ornate-fan'],
                        conflictDiscard: ['fine-katana']
                    }
                });
                this.steward = this.player1.findCardByName('steward-of-law');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.timeForWar = this.player2.findCardByName('time-for-war');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.katana = this.player2.findCardByName('fine-katana');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.steward],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 1 vs 0');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.timeForWar);
            });

            it('can only choose a Bushi character you control', function () {
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).not.toBeAbleToSelect(this.whisperer);
                expect(this.player2).not.toBeAbleToSelect(this.steward);
                expect(this.player2).not.toBeAbleToSelect(this.challenger);
            });

            it('can put a Weapon from the conflict discard pile into play', function () {
                this.player2.clickCard(this.matsuBerserker);
                expect(this.player2).toHavePrompt('Choose a weapon attachment');
                expect(this.player2).toBeAbleToSelect(this.katana);
                this.player2.clickCard(this.katana);
                expect(this.matsuBerserker.attachments).toContain(this.katana);
                expect(this.katana.location).toBe('play area');
            });

            it('cannot put a non-Weapon attachment into play', function () {
                this.player2.clickCard(this.matsuBerserker);
                expect(this.player2).toHavePrompt('Choose a weapon attachment');
                expect(this.player2).toBeAbleToSelect(this.katana);
                expect(this.player2).not.toBeAbleToSelect(this.fan);
            });
        });

        describe('Time For War after losing a military conflict', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['kamayari', 'time-for-war']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('does not trigger', function () {
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a military conflict 1 vs 0');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2.findCardByName('time-for-war').location).toBe('hand');
            });
        });
    });
});
