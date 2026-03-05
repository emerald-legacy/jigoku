describe('Rift to Toshigoku', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'utaku-tetsuko']
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    provinces: ['rift-to-toshigoku']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.tetsuko = this.player1.findCardByName('utaku-tetsuko');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.riftToToshigoku = this.player2.findCardByName('rift-to-toshigoku', 'province 1');
        });

        it('should trigger when attacked, break itself, and opponent discards an attacking character', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto, this.tetsuko],
                province: this.riftToToshigoku,
                type: 'military',
                ring: 'air'
            });

            // Reaction triggers after attack is declared
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.riftToToshigoku);
            this.player2.clickCard(this.riftToToshigoku);
            this.player1.clickPrompt('No'); // Don't discard the card in the province

            // Province breaks as cost
            expect(this.riftToToshigoku.isBroken).toBe(true);

            // Opponent (player1) chooses an attacking character to discard
            expect(this.player1).toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player1).toBeAbleToSelect(this.tetsuko);
            expect(this.player1).not.toBeAbleToSelect(this.initiate);

            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.location).toBe('dynasty discard pile');
        });

        it('should only allow targeting attacking characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                province: this.riftToToshigoku,
                type: 'military',
                ring: 'air'
            });

            this.player2.clickCard(this.riftToToshigoku);
            this.player1.clickPrompt('No'); // Don't discard the card in the province

            // Only attacking characters are valid
            expect(this.player1).toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player1).not.toBeAbleToSelect(this.tetsuko); // at home

            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.location).toBe('dynasty discard pile');
        });
    });
});
