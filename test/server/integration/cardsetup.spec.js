describe('card setup and state', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 0,
                    hand: ['adept-of-shadows'],
                    provinces: ['the-empty-city']
                },
                player2: {
                    provinces: ['the-empty-city']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-shadows');
            this.city = this.player1.findCardByName('the-empty-city');
            this.otherCity = this.player2.findCardByName('the-empty-city');
        });

        it('numbers a card\'s printed abilities, the same for every copy', function() {
            const identifiers = (card) => card.abilities.actions.map((action) => action.abilityIdentifier);

            expect(new Set(identifiers(this.city)).size).toBe(2);
            expect(identifiers(this.otherCity)).toEqual(identifiers(this.city));
        });

        it('lets a play action ignore its cost when asked to', function() {
            const play = this.adept.getPlayActions().find((action) => action.meetsRequirements(action.createContext(this.player1.player)) === 'cost');
            const context = play.createContext(this.player1.player);

            expect(play.meetsRequirements(context, ['cost'])).not.toBe('cost');
        });

        it('keeps the card\'s side on a snapshot', function() {
            expect(this.adept.createSnapshot().isConflictCard()).toBe(true);
        });
    });
});
