describe('Priviledged Position', function() {
    integration(function() {
        describe('Priviledged Position\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['kakita-kaezin'],
                        hand: ['privileged-position']
                    },
                    player2: {
                        inPlay: ['brash-samurai']
                    }
                });
                this.position = this.player1.findCardByName('privileged-position');
                this.kaezin = this.player1.findCardByName('kakita-kaezin');
                this.brash = this.player2.findCardByName('brash-samurai');
            });

            it('should trigger when your opponent bids higher and reduce opponent to 1 conflict opportunity', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.position);
                this.player1.clickCard(this.position);
                expect(this.player1.player.getConflictOpportunities()).toBe(2);
                expect(this.player2.player.getConflictOpportunities()).toBe(1);
                expect(this.getChatLogs(4)).toContain('player1 plays Privileged Position to limit player2 to a single conflict this turn');
            });

            it('does not count a passed opportunity as a declared conflict', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                this.player1.clickCard(this.position);
                this.noMoreActions();
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                expect(this.player2.player.getConflictOpportunities()).toBe(1);
            });

            it('should not trigger when bids are equal and reduce opponent to 1 conflict opportunity', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger when your opponent bids lower and reduce opponent to 1 conflict opportunity', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should trigger on a duel and remove your opponents last conflict choice', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.brash],
                    defenders: [this.kaezin],
                    type: 'political'
                });

                this.player1.clickCard(this.kaezin);
                this.player2.clickCard(this.brash);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.position);
                this.player1.clickCard(this.position);
                expect(this.player1.player.getConflictOpportunities()).toBe(1);
                expect(this.player2.player.getConflictOpportunities()).toBe(0);
            });
        });

        describe('Privileged Position and a modified bid', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        hand: ['privileged-position', 'contingency-plan']
                    },
                    player2: {
                    }
                });
                this.position = this.player1.findCardByName('privileged-position');
                this.contingencyPlan = this.player1.findCardByName('contingency-plan');
            });

            it('should not trigger when the dials are equal and the bid is decreased first', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('2');
                expect(this.player1).toBeAbleToSelect(this.contingencyPlan);
                this.player1.clickCard(this.contingencyPlan);
                this.player1.clickPrompt('Decrease honor bid');
                expect(this.player1.player.honorBid).toBe(1);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
