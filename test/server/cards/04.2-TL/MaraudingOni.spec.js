describe('Marauding Oni', function() {
    integration(function() {
        describe('Marauding Oni\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['marauding-oni']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja']
                    }
                });
                this.noMoreActions();
            });

            it('should make its controller lose one honor when declared as an attacker', function() {
                this.initiateConflict({
                    attackers: ['marauding-oni']
                });
                expect(this.player1.honor).toBe(10);
            });

            it('should make its controller lose one honor when declared as an defender', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['doomed-shugenja'],
                    defenders: ['marauding-oni']
                });
                expect(this.player1.honor).toBe(10);
            });
        });
    });
});

describe('Marauding Oni declared in two conflicts', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 11,
                    inPlay: ['marauding-oni', 'moto-nergui']
                },
                player2: {
                    inPlay: ['doomed-shugenja']
                }
            });
            this.oni = this.player1.findCardByName('marauding-oni');
            this.nergui = this.player1.findCardByName('moto-nergui');
            this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
            this.noMoreActions();
        });

        it('makes its controller lose one honor for each declaration (ruling #507)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.oni, this.nergui],
                defenders: []
            });
            expect(this.player1.honor).toBe(10);
            this.player2.pass();
            this.player1.clickCard(this.nergui);
            this.player1.clickCard(this.oni);
            expect(this.oni.isParticipating()).toBe(false);
            expect(this.oni.bowed).toBe(false);
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.game.currentConflict).toBeNull();
            expect(this.player1.honor).toBe(10);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomedShugenja],
                defenders: [this.oni]
            });
            expect(this.oni.isParticipating()).toBe(true);
            expect(this.player1.honor).toBe(9);
        });
    });
});
