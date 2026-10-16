describe('Kamayari', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ide-ryoma', 'doji-whisperer']
                },
                player2: {
                    inPlay: [{ card: 'matsu-berserker', attachments: ['kamayari'] }]
                }
            });
            this.ryoma = this.player1.findCardByName('ide-ryoma');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.kamayari = this.player2.findCardByName('kamayari');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ryoma, this.whisperer],
                defenders: [this.berserker]
            });
            this.player2.pass();
        });

        it('bows a character that triggers an ability', function() {
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.kamayari);
            expect(this.ryoma.bowed).toBe(true);
        });

        it('is offered once per ability, not again when a step of it starts', function() {
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.kamayari);
            this.player2.clickPrompt('Pass');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});
