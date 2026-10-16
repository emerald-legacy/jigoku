describe('Respected Connoisseur', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'respected-connoisseur', honor: 'honored' },
                        'akodo-gunso',
                        'doji-whisperer'
                    ]
                },
                player2: {
                    inPlay: ['matsu-berserker', 'doji-challenger']
                }
            });
            this.connoisseur = this.player1.findCardByName('respected-connoisseur');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should honor another participating character while it is participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.connoisseur, this.gunso],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.connoisseur);
            expect(this.player1).toHavePrompt('Respected Connoisseur');
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.connoisseur);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.gunso);
            expect(this.gunso.isHonored).toBe(true);
        });

        it('should honor another character at home while it is at home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gunso],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.connoisseur);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.gunso);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isHonored).toBe(true);
        });

        it('should not be usable while it is not honored', function() {
            this.connoisseur.makeOrdinary();
            this.player1.clickCard(this.connoisseur);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.whisperer.isHonored).toBe(false);
        });
    });
});
