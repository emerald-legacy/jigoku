describe('Ascetic Visionary 2', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['ascetic-visionary-2', 'togashi-initiate', 'mirumoto-raitsugu', 'brash-samurai']
                },
                player2: {
                    inPlay: ['keeper-initiate', 'miya-mystic']
                }
            });

            this.asceticVisionary = this.player1.findCardByName('ascetic-visionary-2');
            this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
            this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
            this.miyaMystic = this.player2.findCardByName('miya-mystic');

            this.togashiInitiate.bowed = true;
            this.raitsugu.bowed = true;
            this.keeperInitiate.bowed = true;
        });

        it('should not be usable outside a conflict', function() {
            this.player1.clickCard(this.asceticVisionary);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.togashiInitiate.bowed).toBe(true);
        });

        it('should only target bowed Monk characters, on either side', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.asceticVisionary);
            expect(this.player1).toHavePrompt('Ascetic Visionary');
            expect(this.player1).toBeAbleToSelect(this.togashiInitiate);
            expect(this.player1).toBeAbleToSelect(this.keeperInitiate);
            expect(this.player1).not.toBeAbleToSelect(this.asceticVisionary);
            expect(this.player1).not.toBeAbleToSelect(this.raitsugu);
            expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
        });

        it('should work from home: spend 1 fate to an unclaimed ring and ready the Monk', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'fire',
                attackers: [this.brashSamurai],
                defenders: []
            });
            this.player2.pass();
            const airFate = this.game.rings.air.fate;
            this.player1.clickCard(this.asceticVisionary);
            this.player1.clickCard(this.togashiInitiate);
            expect(this.player1).toHavePrompt('Select a ring to place fate on');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            this.player1.clickRing('air');
            expect(this.togashiInitiate.bowed).toBe(false);
            expect(this.player1.fate).toBe(4);
            expect(this.game.rings.air.fate).toBe(airFate + 1);
            expect(this.asceticVisionary.isParticipating()).toBe(false);
        });

        it('should not be usable without fate to spend', function() {
            this.player1.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.asceticVisionary);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.togashiInitiate.bowed).toBe(true);
        });
    });
});
