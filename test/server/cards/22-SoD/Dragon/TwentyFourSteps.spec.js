describe('Twenty-Four Steps', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-challenger', 'togashi-initiate', 'togashi-initiate', 'matsu-berserker', { card: 'hida-kotoe', attachments: ['fine-katana', 'ornate-fan'] }],
                    hand: ['twenty-four-steps']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.initiate1 = this.player1.filterCardsByName('togashi-initiate')[0];
            this.initiate2 = this.player1.filterCardsByName('togashi-initiate')[1];
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.kotoe = this.player1.findCardByName('hida-kotoe');
            this.steps = this.player1.findCardByName('twenty-four-steps');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('should move up to two Monks you control to the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.steps);
            this.player1.clickPrompt('Move two monks to the conflict');
            expect(this.player1).toBeAbleToSelect(this.initiate1);
            expect(this.player1).toBeAbleToSelect(this.initiate2);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.initiate1);
            this.player1.clickCard(this.initiate2);
            this.player1.clickPrompt('Done');
            expect(this.initiate1.isParticipating()).toBe(true);
            expect(this.initiate2.isParticipating()).toBe(true);
        });

        it('should ready a Bushi you control with at least two attachments and move it to the conflict', function() {
            this.kotoe.bowed = true;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.steps);
            this.player1.clickPrompt('Ready a character and move it to the conflict');
            expect(this.player1).toBeAbleToSelect(this.kotoe);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.initiate1);
            this.player1.clickCard(this.kotoe);
            expect(this.kotoe.bowed).toBe(false);
            expect(this.kotoe.isParticipating()).toBe(true);
        });

        it('should not be playable in a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.steps);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.steps.location).toBe('hand');
        });
    });
});
