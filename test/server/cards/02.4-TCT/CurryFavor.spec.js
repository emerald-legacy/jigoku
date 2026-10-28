describe('Curry Favor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider', 'brash-samurai', 'kitsuki-investigator', 'moto-chagatai'],
                    hand: ['curry-favor']
                },
                player2: {
                    inPlay: ['ikoma-prodigy']
                }
            });

            this.rider = this.player1.findCardByName('border-rider');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.investigator = this.player1.findCardByName('kitsuki-investigator');
            this.chagatai = this.player1.findCardByName('moto-chagatai');
            this.curryFavor = this.player1.findCardByName('curry-favor');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.province2 = this.player2.findCardByName(fillers.province, 'province 2');

            // the first conflict player1 declared
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rider],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t resolve');
        });

        it('should not trigger after the first conflict you declared', function() {
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 2 vs 0');
            expect(this.rider.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.curryFavor.location).toBe('hand');
        });

        describe('in a conflict declared by the opponent', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: [this.prodigy],
                    defenders: [this.brash]
                });
                this.noMoreActions();
                this.player2.clickPrompt('Don\'t resolve');
            });

            it('should not trigger even though it was the second conflict of the round', function() {
                expect(this.getChatLogs(10)).toContain('player2 won a political conflict 2 vs 1');
                expect(this.brash.bowed).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.curryFavor.location).toBe('hand');
            });

            describe('and then the second conflict you declared', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        ring: 'water',
                        province: this.province2,
                        attackers: [this.investigator, this.chagatai],
                        defenders: []
                    });
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t resolve');
                });

                it('should ready a character that bowed as a result of conflict resolution', function() {
                    expect(this.getChatLogs(10)).toContain('player1 won a political conflict 6 vs 0');
                    expect(this.investigator.bowed).toBe(true);
                    expect(this.player1).toHavePrompt('Any reactions to Kitsuki Investigator being bowed?');
                    expect(this.player1).toBeAbleToSelect(this.curryFavor);
                    this.player1.clickCard(this.curryFavor);
                    expect(this.investigator.bowed).toBe(false);
                    expect(this.curryFavor.location).toBe('conflict discard pile');
                    expect(this.getChatLogs(5)).toContain('player1 plays Curry Favor to ready Kitsuki Investigator');
                });

                // Moto Chagatai does not bow in a conflict that broke a province
                it('should not trigger for a character that did not bow', function() {
                    expect(this.chagatai.bowed).toBe(false);
                    expect(this.player1).not.toHavePrompt('Any reactions to Moto Chagatai being bowed?');
                    this.player1.clickPrompt('Pass');
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                    expect(this.player1).not.toHavePrompt('Any reactions to Moto Chagatai being bowed?');
                    expect(this.curryFavor.location).toBe('hand');
                    expect(this.chagatai.isParticipating()).toBe(false);
                });
            });
        });
    });
});
