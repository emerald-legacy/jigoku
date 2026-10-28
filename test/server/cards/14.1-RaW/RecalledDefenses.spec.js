describe('Recalled Defenses', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['naive-student'],
                    dynastyDiscard: ['bustling-academy','kanjo-district', 'recalled-defenses', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['moto-youth','shinjo-scout'],
                    dynastyDiscard:['shiotome-encampment'],
                    hand: []
                }
            });

            this.ba = this.player1.placeCardInProvince('bustling-academy','province 1');
            this.kd = this.player1.placeCardInProvince('kanjo-district','province 2');
            this.naive = this.player1.findCardByName('naive-student');
            this.defenses = this.player1.placeCardInProvince('recalled-defenses', 'province 3');
            this.player1.moveCard(this.naive, 'province 1');

            this.shio = this.player2.placeCardInProvince('shiotome-encampment','province 1');
            this.youth = this.player2.placeCardInProvince('moto-youth','province 2');
            this.scout = this.player2.findCardByName('shinjo-scout');
        });

        it('should correctly target cards in provinces', function() {
            this.player1.clickCard(this.defenses);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.ba);
            expect(this.player1).toBeAbleToSelect(this.kd);
            expect(this.player1).toBeAbleToSelect(this.naive);
            expect(this.player1).not.toBeAbleToSelect(this.shio);
            expect(this.player1).not.toBeAbleToSelect(this.youth);
            expect(this.player1).not.toBeAbleToSelect(this.defenses);
            expect(this.player1).not.toBeAbleToSelect(this.scout);
        });

        it('should not target a card already in the stronghold province', function() {
            const strongholdCard = this.player1.moveCard('doji-whisperer', 'stronghold province');
            this.player1.clickCard(this.defenses);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(strongholdCard);
        });

        it('should move the targeted card to the stronghold province', function() {
            this.player1.clickCard(this.defenses);
            this.player1.clickCard(this.kd);
            expect(this.kd.location).toBe('stronghold province');
        });

        it('should not name a facedown card in chat', function() {
            this.kd.facedown = true;
            this.player1.clickCard(this.defenses);
            this.player1.clickCard(this.kd);
            expect(this.kd.location).toBe('stronghold province');
            expect(this.kd.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays Recalled Defenses to move a facedown card to their stronghold province');
        });

        it('should correctly discard itself', function() {
            this.player1.clickCard(this.defenses);
            this.player1.clickCard(this.ba);
            expect(this.defenses.location).toBe('dynasty discard pile');
        });
    });
});
