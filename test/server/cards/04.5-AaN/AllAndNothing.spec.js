describe('All and Nothing', function() {
    integration(function() {
        describe('All and Nothing\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-kaede', 'seeker-of-knowledge'],
                        hand: ['all-and-nothing', 'all-and-nothing', 'taryu-jiai']
                    },
                    player2: {
                        inPlay: ['miya-mystic']
                    }
                });
                this.miyaMystic = this.player2.findCardByName('miya-mystic');
                this.miyaMystic.fate = 2;
                this.noMoreActions();
            });

            it('should trigger when the player resolves the void effect', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'void',
                    attackers: ['seeker-of-knowledge'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('void');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('all-and-nothing');
                this.handSize = this.player1.hand.length;
                this.deckSize = this.player1.conflictDeck.length;
                this.allAndNothing = this.player1.clickCard('all-and-nothing');
                expect(this.player1).toHavePrompt('All and Nothing');
                expect(this.player1).not.toBeAbleToSelectRing('void');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Fire Ring');
                this.isawaKaede = this.player1.clickCard('isawa-kaede');
                this.player1.clickPrompt('Honor Isawa Kaede');
                expect(this.isawaKaede.isHonored).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 plays All and Nothing to resolve Fire Ring effect instead of the void effect');
                expect(this.allAndNothing.location).toBe('conflict discard pile');
                expect(this.player1.hand.length).toBe(this.handSize);
                expect(this.player1.conflictDeck.length).toBe(this.deckSize - 1);
            });

            it('should not trigger when the player resolves another ring effect', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'void',
                    attackers: ['seeker-of-knowledge'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should trigger when Kaede resolves the void effect on a non-void ring', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: ['isawa-kaede'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickPrompt('Resolve All Elements');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('all-and-nothing');
                this.player1.clickCard('all-and-nothing');
                expect(this.player1).toHavePrompt('All and Nothing');
                // ruling #493: the ring that was given the Void effect is not "another ring"
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                this.player1.clickRing('void');
                this.allAndNothing = this.player1.findCardByName('all-and-nothing', 'hand');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.allAndNothing);
                this.player1.clickCard(this.allAndNothing);
                expect(this.player1).toHavePrompt('All and Nothing');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Fire Ring');
                this.isawaKaede = this.player1.clickCard('isawa-kaede');
                this.player1.clickPrompt('Honor Isawa Kaede');
                expect(this.isawaKaede.isHonored).toBe(true);
                expect(this.player1).toHavePrompt('Fire Ring');
            });

            it('should trigger when the player resolves the void effect using Taryu Jiai', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: ['seeker-of-knowledge'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('taryu-jiai');
                expect(this.player1).toHavePrompt('Choose a friendly shugenja');
                this.player1.clickCard('isawa-kaede');
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Choose a ring effect to resolve');
                this.player1.clickRing('void');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('all-and-nothing');
                this.player1.clickCard('all-and-nothing');
                expect(this.player1).toHavePrompt('All and Nothing');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Fire Ring');
                this.isawaKaede = this.player1.clickCard('isawa-kaede');
                this.player1.clickPrompt('Honor Isawa Kaede');
                expect(this.isawaKaede.isHonored).toBe(true);
            });
        });
    });
});
