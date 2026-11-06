describe('Forward Patrol', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['forward-patrol', 'matsu-berserker', 'doji-whisperer', 'hida-kotoe']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.patrol = this.player1.findCardByName('forward-patrol');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.kotoe = this.player1.findCardByName('hida-kotoe');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should ready a participating Bushi', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.patrol, this.berserker, this.whisperer],
                defenders: [this.challenger]
            });
            this.berserker.bowed = true;
            this.whisperer.bowed = true;
            this.challenger.bowed = true;
            this.kotoe.bowed = true;
            this.player2.pass();
            this.player1.clickCard(this.patrol);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.kotoe);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.bowed).toBe(false);
        });

        it('should not be usable while it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.challenger]
            });
            this.berserker.bowed = true;
            this.player2.pass();
            this.player1.clickCard(this.patrol);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.bowed).toBe(true);
        });

        it('should not be usable outside of a conflict', function() {
            this.berserker.bowed = true;
            this.player1.clickCard(this.patrol);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.berserker.bowed).toBe(true);
        });
    });
});
