describe('Costs to target', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'adept-of-the-waves'],
                    hand: ['to-show-the-path', 'forged-edict']
                },
                player2: {
                    fate: 7,
                    inPlay: ['doji-challenger'],
                    hand: ['assassination']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.clickCard('to-show-the-path');
            this.player1.clickCard(this.whisperer);
            this.noMoreActions();
            this.initiateConflict({ attackers: ['adept-of-the-waves'], defenders: [] });
        });

        it('are paid after the ability\'s line', function () {
            this.player2.clickCard('assassination');
            this.player2.clickCard(this.whisperer);
            this.player1.clickPrompt('Pass');

            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.player2.fate).toBe(6);
            const chat = this.getChatLogs(5);
            const played = chat.indexOf('player2 plays Assassination, losing 3 honor to discard Doji Whisperer');
            expect(played).toBeGreaterThan(-1);
            expect(chat.indexOf('player2 pays 1 fate in order to target Doji Whisperer')).toBe(played + 1);
        });

        it('are paid even when the effects are cancelled', function () {
            this.player2.clickCard('assassination');
            this.player2.clickCard(this.whisperer);
            this.player1.clickCard('forged-edict');
            this.player1.clickCard(this.whisperer);

            expect(this.whisperer.location).toBe('play area');
            expect(this.player2.fate).toBe(6);
            expect(this.getChatLogs(5)).toContain('player2 pays 1 fate in order to target Doji Whisperer');
        });
    });
});

describe('A targeting cost on top of an additional cost to trigger (Magistrate of Reason)', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['magistrate-of-reason', 'adept-of-the-waves', 'doji-challenger'],
                    hand: ['to-show-the-path']
                },
                player2: {
                    fate: 1,
                    inPlay: ['adept-of-the-waves']
                }
            });
            this.magistrate = this.player1.findCardByName('magistrate-of-reason');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.path = this.player1.findCardByName('to-show-the-path');
            this.adept2 = this.player2.findCardByName('adept-of-the-waves');

            this.player1.clickCard(this.path);
            this.player1.clickCard(this.challenger);
            expect(this.getChatLogs(5).some((line) => line.includes('To Show the Path'))).toBe(true);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.magistrate],
                defenders: [],
                type: 'military'
            });
        });

        it('does not offer a target whose fate cost can\'t be paid besides the fate to a ring', function () {
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.fate).toBe(1);
            this.player2.clickCard(this.adept2);
            expect(this.player2).toBeAbleToSelect(this.adept2);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
        });
    });
});
