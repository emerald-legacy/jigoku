describe('Isawa Masahiro', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-masahiro', 'valiant-oathkeeper']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'samurai-of-integrity', 'serene-warrior', 'valiant-oathkeeper']
                }
            });
            this.masahiro = this.player1.findCardByName('isawa-masahiro');
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.samurai = this.player2.findCardByName('samurai-of-integrity');
            this.sereneWarrior = this.player2.findCardByName('serene-warrior');
            this.p2Oathkeeper = this.player2.findCardByName('valiant-oathkeeper');
            this.noMoreActions();
        });

        it('during a Fire conflict bows itself to discard a participating character with printed cost 2 or lower', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.oathkeeper],
                defenders: [this.whisperer, this.samurai, this.sereneWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.masahiro);
            expect(this.player1).toHavePrompt('Isawa Masahiro');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.samurai);
            expect(this.player1).toBeAbleToSelect(this.oathkeeper);
            expect(this.player1).not.toBeAbleToSelect(this.sereneWarrior);
            expect(this.player1).not.toBeAbleToSelect(this.p2Oathkeeper);
            expect(this.player1).not.toBeAbleToSelect(this.masahiro);
            this.player1.clickCard(this.samurai);
            expect(this.samurai.location).toBe('dynasty discard pile');
            expect(this.masahiro.bowed).toBe(true);
        });

        it('cannot be used during a conflict of another element', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.oathkeeper],
                defenders: [this.whisperer, this.samurai]
            });
            this.player2.pass();
            this.player1.clickCard(this.masahiro);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.masahiro.bowed).toBe(false);
            expect(this.samurai.location).toBe('play area');
        });

        it('cannot be used while it is bowed', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.oathkeeper],
                defenders: [this.whisperer, this.samurai]
            });
            this.masahiro.bow();
            this.player2.pass();
            this.player1.clickCard(this.masahiro);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.samurai.location).toBe('play area');
            expect(this.whisperer.location).toBe('play area');
        });
    });
});
