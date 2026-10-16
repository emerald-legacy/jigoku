describe('Trail of Blood and Lies', function () {
    integration(function () {
        function setup(inPlay) {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay,
                    hand: ['mono-no-aware', 'trail-of-blood-and-lies']
                },
                player2: {
                    inPlay: ['doji-challenger', 'kakita-yoshi']
                }
            });

            this.monoNoAware = this.player1.findCardByName('mono-no-aware');
            this.trail = this.player1.findCardByName('trail-of-blood-and-lies');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');

            this.challenger.fate = 1;
        }

        it('makes the opponent dishonor a character', function () {
            setup.call(this, ['doji-whisperer']);
            this.player1.clickCard(this.monoNoAware);
            expect(this.player1).toHavePrompt('Triggered Abilities');

            this.player1.clickCard(this.trail);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.yoshi);

            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.yoshi.isDishonored).toBe(false);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('may resolve twice while you control a Magistrate', function () {
            setup.call(this, ['doji-whisperer', 'cunning-magistrate']);
            this.player1.clickCard(this.monoNoAware);
            this.player1.clickCard(this.trail);
            this.player2.clickCard(this.challenger);

            expect(this.player1).toHavePrompt('Resolve this ability again?');
            this.player1.clickPrompt('Yes');
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.yoshi);

            this.player2.clickCard(this.yoshi);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.yoshi.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 chooses to resolve Trail of Blood and Lies again');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('resolves once when you decline', function () {
            setup.call(this, ['doji-whisperer', 'cunning-magistrate']);
            this.player1.clickCard(this.monoNoAware);
            this.player1.clickCard(this.trail);
            this.player2.clickCard(this.challenger);

            this.player1.clickPrompt('No');
            expect(this.yoshi.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 chooses not to resolve Trail of Blood and Lies again');
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
