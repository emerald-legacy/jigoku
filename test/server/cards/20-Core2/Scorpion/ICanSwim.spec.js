describe('I Can Swim', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['i-can-swim']
                },
                player2: {
                    inPlay: [
                        { card: 'matsu-berserker', honor: 'dishonored' },
                        { card: 'doji-whisperer', honor: 'dishonored' },
                        'bayushi-manipulator'
                    ]
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.iCanSwim = this.player1.findCardByName('i-can-swim');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.manipulator = this.player2.findCardByName('bayushi-manipulator');
        });

        it('discards a dishonored character on the opponent\'s side when your bid is higher', function() {
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('1');
            this.player2.clickPrompt('Pass');
            this.noMoreActions();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.berserker, this.manipulator]
            });
            this.player2.pass();
            this.player1.clickCard(this.iCanSwim);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.manipulator);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.berserker);

            expect(this.berserker.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays I Can Swim to discard Matsu Berserker');
        });

        it('cannot be played when the bids are equal', function() {
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('2');
            this.player2.clickPrompt('Pass');
            this.noMoreActions();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.iCanSwim);

            expect(this.iCanSwim.location).toBe('hand');
            expect(this.berserker.location).toBe('play area');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        // ruling #56: an effect that modifies the bid doesn't change the setting on the dial
        it('compares the dials, not bids modified by an effect', function() {
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('2');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.manipulator);
            expect(this.player2.player.honorBid).toBe(3);
            expect(this.player2.player.showBid).toBe(2);
            this.noMoreActions();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.berserker]
            });
            this.player2.pass();
            expect(this.player2.player.honorBid).toBe(3);
            this.player1.clickCard(this.iCanSwim);
            this.player1.clickCard(this.berserker);

            expect(this.berserker.location).toBe('dynasty discard pile');
        });
    });
});
