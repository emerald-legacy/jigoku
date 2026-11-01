describe('Ujiaki\'s Offer', function() {
    integration(function() {
        describe('Ujiaki\'s Offer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-adept', 'bayushi-shoju']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['ujiaki-s-offer']
                    }
                });

                this.adept = this.player1.findCardByName('niten-adept');
                this.shoju = this.player1.findCardByName('bayushi-shoju');

                this.offer = this.player2.findCardByName('ujiaki-s-offer');
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');

            });

            it('should only trigger during a political conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shoju],
                    defenders: [this.toshimoko]
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.offer);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should dishonor, bow, move home, and place 1 fate on a lower costed char', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.shoju],
                    defenders: [this.toshimoko]
                });
                const adeptFate = this.adept.fate;
                this.player2.clickCard(this.offer);
                this.player2.clickCard(this.adept);
                expect(this.adept.fate).toBe(adeptFate + 1);
                expect(this.adept.bowed).toBe(true);
                expect(this.adept.inConflict).toBe(false);
                expect(this.adept.isDishonored).toBe(true);
                expect(this.getChatLogs(5)).toContain('player2 plays Ujiaki\'s Offer to place a fate on Niten Adept then bow, dishonor, and move them home');
            });

            it('it should only work on characters of less value', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.shoju],
                    defenders: [this.toshimoko]
                });
                this.player2.clickCard(this.offer);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.adept);
                expect(this.player2).not.toBeAbleToSelect(this.shoju);
            });
        });
    });
});

describe('Ujiaki\'s Offer - cost comparison', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['niten-adept', 'bayushi-shoju', 'chikai-order-protector', 'doji-challenger']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['ujiaki-s-offer']
                }
            });

            this.adept = this.player1.findCardByName('niten-adept');
            this.shoju = this.player1.findCardByName('bayushi-shoju');
            this.protector = this.player1.findCardByName('chikai-order-protector');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.offer = this.player2.findCardByName('ujiaki-s-offer');
            this.challenger2 = this.player2.findCardByName('doji-challenger');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.adept, this.shoju, this.protector, this.challenger],
                defenders: [this.challenger2]
            });
        });

        it('can choose a character whose printed cost is equal to that of a participating character you control', function() {
            this.player2.clickCard(this.offer);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.challenger);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.fate).toBe(1);
            expect(this.challenger.bowed).toBe(true);
            expect(this.challenger.inConflict).toBe(false);
            expect(this.challenger.isDishonored).toBe(true);
        });

        it('only compares with participating characters you control', function() {
            this.player2.clickCard(this.offer);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.adept);
            expect(this.player2).not.toBeAbleToSelect(this.protector);
            expect(this.player2).not.toBeAbleToSelect(this.shoju);
            expect(this.player2).not.toBeAbleToSelect(this.challenger2);
        });
    });
});
