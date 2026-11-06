describe('Spyglass', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'shinjo-outrider', attachments: ['spyglass-2'] }, 'border-rider']
                },
                player2: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['spyglass-2'] }, 'doji-challenger']
                }
            });
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should draw a card after the attached character is declared as an attacker', function() {
            const hand = this.player1.hand.length;
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.outrider]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.outrider);
            this.player1.clickCard(this.outrider);
            expect(this.player1.hand.length).toBe(hand + 1);
        });

        it('should draw a card after the attached character is declared as a defender', function() {
            const hand = this.player2.hand.length;
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.borderRider],
                defenders: [this.whisperer]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.whisperer);
            expect(this.player2.hand.length).toBe(hand + 1);
        });

        it('should draw a card after the attached character moves to the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.borderRider],
                defenders: [this.challenger]
            });
            this.player2.pass();
            const hand = this.player1.hand.length;
            this.player1.clickCard(this.outrider);
            expect(this.outrider.isParticipating()).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.outrider);
            this.player1.clickCard(this.outrider);
            expect(this.player1.hand.length).toBe(hand + 1);
        });

        it('should not trigger when another character is declared', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.borderRider],
                defenders: [this.challenger]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
