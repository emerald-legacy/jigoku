describe('Under the New Moon', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['border-rider', 'moto-youth'],
                    hand: ['under-the-new-moon']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'doji-challenger']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.motoYouth = this.player1.findCardByName('moto-youth');
            this.newMoon = this.player1.findCardByName('under-the-new-moon');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('should make the opponent declare defenders first and force the chosen number of attackers', function() {
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.newMoon);
            this.player1.clickCard(this.newMoon);
            expect(this.player1.honor).toBe(9);
            expect(this.player1).toHavePrompt('Choose how many characters will be attacking');
            expect(this.player1).not.toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            this.player1.clickPrompt('1');
            expect(this.getChatLogs(3)).toContain('player1 will attack with 1 character');

            expect(this.player2).toHavePrompt('Choose Defenders');
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Initiate Conflict');
            this.player1.clickRing('air');
            this.player1.clickCard(this.shamefulDisplay);
            this.player1.clickCard(this.borderRider);
            expect(this.player1).toHavePromptButton('Initiate Conflict');
            this.player1.clickCard(this.motoYouth);
            expect(this.player1).not.toHavePromptButton('Initiate Conflict');
            this.player1.clickCard(this.motoYouth);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.game.currentConflict.attackers).toContain(this.borderRider);
            expect(this.game.currentConflict.defenders).toContain(this.whisperer);
            expect(this.game.currentConflict.defenders).not.toContain(this.challenger);
        });

        it('should not trigger when the opponent declares a conflict', function() {
            this.noMoreActions();
            this.player1.clickPrompt('Pass');
            this.player1.passConflict();
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Initiate Conflict');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
