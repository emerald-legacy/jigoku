describe('Tears of Amaterasu', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso', 'matsu-berserker', 'doji-whisperer']
                },
                player2: {
                    role: 'keeper-of-water',
                    fate: 5,
                    provinces: ['tears-of-amaterasu']
                }
            });
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.tears = this.player2.findCardByName('tears-of-amaterasu');
        });

        it('should gain 1 fate for each attacking character when revealed', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.tears,
                attackers: [this.gunso, this.berserker]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.tears);
            this.player2.clickCard(this.tears);
            expect(this.player2.fate).toBe(7);
        });

        it('should count only the attacking characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                province: this.tears,
                attackers: [this.gunso]
            });
            this.player2.clickCard(this.tears);
            expect(this.player2.fate).toBe(6);
        });

        it('should not trigger when the province is already faceup', function() {
            this.tears.facedown = false;
            this.game.checkGameState(true);
            this.noMoreActions();
            this.initiateConflict({
                province: this.tears,
                attackers: [this.gunso, this.berserker]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.player2.fate).toBe(5);
        });
    });
});
