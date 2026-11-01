describe('Sashimono', function() {
    integration(function() {
        describe('Sashimono\'s persistent ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['lion-s-pride-brawler', 'miya-mystic'],
                        hand: ['sashimono', 'captive-audience']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja'],
                        hand: ['let-go']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.lPB = this.player1.findCardByName('lion-s-pride-brawler');
                this.sashimono = this.player1.playAttachment('sashimono', this.lPB);
                this.noMoreActions();
            });

            it('should stop its user bowing as an attacker in a military conflict', function() {
                expect(this.lPB.bowsOnReturnHome()).toBe(true);
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.lPB, this.miyaMystic],
                    defenders: [],
                    jumpTo: 'resolve'
                });
                expect(this.lPB.bowsOnReturnHome()).toBe(false);
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.lPB.bowed).toBe(false);
                expect(this.miyaMystic.bowed).toBe(true);
            });

            it('should not stop its user bowing as an attacker in a political conflict', function() {
                expect(this.lPB.bowsOnReturnHome()).toBe(true);
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.lPB, this.miyaMystic],
                    defenders: [],
                    jumpTo: 'resolve'
                });
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.lPB.bowsOnReturnHome()).toBe(true);
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.lPB.bowed).toBe(true);
                expect(this.miyaMystic.bowed).toBe(true);
            });
        });
    });
});

describe('Sashimono attach restriction', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['lion-s-pride-brawler'],
                    hand: ['sashimono']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.brawler = this.player1.findCardByName('lion-s-pride-brawler');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('attaches only to a Bushi you control', function () {
            this.player1.clickCard('sashimono');
            expect(this.player1).toBeAbleToSelect(this.brawler);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });
    });
});
