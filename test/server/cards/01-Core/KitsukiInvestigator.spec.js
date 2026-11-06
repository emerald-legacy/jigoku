describe('Kitsuki Investigator', function() {
    integration(function() {
        describe('Togashi Yokuni and max abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-investigator']
                    },
                    player2: {
                        hand: ['banzai', 'banzai', 'banzai', 'assassination', 'fine-katana'],
                        dynastyDiscard: ['chukan-nobue']
                    }
                });
                this.kitsukiInvestigator = this.player1.findCardByName('kitsuki-investigator');
                this.katana = this.player2.findCardByName('fine-katana');
                this.nobue = this.player2.findCardByName('chukan-nobue');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kitsukiInvestigator],
                    defenders: []
                });
            });

            it('should pay a fate to a ring to discard a card', function() {
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickRing('fire');
                expect(this.player1).toHavePromptButton('Banzai! (3)');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('Fine Katana');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work with nobue', function() {
                this.player2.moveCard(this.nobue, 'play area');
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickRing('fire');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 uses Kitsuki Investigator, placing 1 fate on the Fire Ring to look at player2\'s hand and discard a card from it');
                expect(this.getChatLogs(3)).toContain('Kitsuki Investigator sees Assassination, Banzai!, Banzai!, Banzai! and Fine Katana');
            });
        });

        describe('two Kitsuki Investigators', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['kitsuki-investigator', 'kitsuki-investigator']
                    },
                    player2: {
                        hand: ['banzai', 'assassination', 'fine-katana']
                    }
                });
                [this.investigator1, this.investigator2] = this.player1.filterCardsByName('kitsuki-investigator', 'play area');
                this.katana = this.player2.findCardByName('fine-katana');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('cannot be used while it is not participating in the political conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.investigator1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.investigator2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2.hand.length).toBe(3);
                expect(this.player1.fate).toBe(5);
                this.player1.clickCard(this.investigator1);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Fine Katana');
                expect(this.katana.location).toBe('conflict discard pile');
            });

            it('cannot be used during a military conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.investigator1, this.investigator2],
                    defenders: []
                });
                this.player2.pass();
                expect(this.investigator1.isParticipating()).toBe(true);
                this.player1.clickCard(this.investigator1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2.hand.length).toBe(3);
                expect(this.player1.fate).toBe(5);
            });

            it('only one copy can be triggered per conflict (ruling #68)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.investigator1, this.investigator2],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.investigator1);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Fine Katana');
                expect(this.katana.location).toBe('conflict discard pile');
                this.player2.pass();
                this.player1.clickCard(this.investigator2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.assassination.location).toBe('hand');
                expect(this.player2.hand.length).toBe(2);
                expect(this.player1.fate).toBe(4);
            });
        });
    });
});
