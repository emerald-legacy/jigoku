describe('False Loyalites', function() {
    integration(function() {
        describe('False Loyalites\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker','shinjo-shono', 'shrine-maiden'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['venerable-historian', 'solemn-scholar'],
                        hand: ['false-loyalties'],
                        honor: 8
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.shono = this.player1.findCardByName('shinjo-shono');
                this.maiden = this.player1.findCardByName('shrine-maiden');

                this.historian = this.player2.findCardByName('venerable-historian');
                this.scholar = this.player2.findCardByName('solemn-scholar');

                this.noMoreActions();
            });

            it('should trigger after a opponent wins a conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('false-loyalties');
            });

            it('should let you switch the character in the conflicts', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickCard('false-loyalties');
                this.player2.clickCard(this.shono);
                expect(this.player2).toBeAbleToSelect(this.maiden);
                this.player2.clickCard(this.maiden);
                expect(this.shono.inConflict).toBe(false);
                expect(this.maiden.inConflict).toBe(true);
            });

            it('should not let you move in dash characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickCard('false-loyalties');
                this.player2.clickCard(this.shono);
                expect(this.player2).not.toBeAbleToSelect(this.berserker);
            });

            it('should only work for opponents characters', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: [this.historian]
                });
                this.noMoreActions();
                this.player2.clickCard('false-loyalties');
                expect(this.player2).toBeAbleToSelect(this.shono);
                expect(this.player2).not.toBeAbleToSelect(this.historian);
            });
        });

        describe('False Loyalties\'s honor and winner conditions', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-shono', 'shrine-maiden']
                    },
                    player2: {
                        inPlay: ['venerable-historian', 'solemn-scholar'],
                        hand: ['false-loyalties']
                    }
                });

                this.shono = this.player1.findCardByName('shinjo-shono');
                this.maiden = this.player1.findCardByName('shrine-maiden');
                this.historian = this.player2.findCardByName('venerable-historian');
                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.falseLoyalties = this.player2.findCardByName('false-loyalties');

                this.noMoreActions();
            });

            it('does not trigger when the winning opponent has equal honor', function() {
                this.player1.honor = 10;
                this.player2.honor = 10;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: [this.historian]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 1');
                expect(this.player1.honor).toBe(10);
                expect(this.player2.honor).toBe(10);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.falseLoyalties.location).toBe('hand');
            });

            it('does not trigger when the winning opponent has less honor', function() {
                this.player1.honor = 8;
                this.player2.honor = 10;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: [this.historian]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 1');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.falseLoyalties.location).toBe('hand');
            });

            it('does not trigger when you win the conflict', function() {
                this.player1.honor = 10;
                this.player2.honor = 8;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.maiden],
                    defenders: [this.historian, this.scholar]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player2 won a political conflict 2 vs 1');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.falseLoyalties.location).toBe('hand');
            });
        });
    });
});
