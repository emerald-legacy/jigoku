describe('Arbiter of Authority', function() {
    integration(function() {
        describe('Arbiter of Authority\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['arbiter-of-authority']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu']
                    }
                });
                this.arbiterOfAuthority = this.player1.findCardByName('arbiter-of-authority');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.arbiterOfAuthority);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt your opponent to refuse the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.arbiterOfAuthority],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.arbiterOfAuthority);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player2).toHavePrompt('Do you wish to refuse the duel?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');
            });

            it('should dishonor the duel target and end the duel with no effect if the duel is refused', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.arbiterOfAuthority],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.arbiterOfAuthority);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.clickPrompt('Yes');
                expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player2 chooses to refuse the duel and dishonor Mirumoto Raitsugu');
            });

            it('should bow and move home the loser', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.arbiterOfAuthority],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.arbiterOfAuthority);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.clickPrompt('No');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.arbiterOfAuthority.isParticipating()).toBe(false);
                expect(this.arbiterOfAuthority.bowed).toBe(true);
                expect(this.mirumotoRaitsugu.isParticipating()).toBe(true);
                expect(this.mirumotoRaitsugu.bowed).toBe(false);
            });
        });

        describe('Arbiter of Authority refused with a redirected dishonor', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['arbiter-of-authority']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'kitsuki-shomon']
                    }
                });
                this.arbiterOfAuthority = this.player1.findCardByName('arbiter-of-authority');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.shomon = this.player2.findCardByName('kitsuki-shomon');
            });

            it('should resolve the duel if Kitsuki Shomon is dishonored instead', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.arbiterOfAuthority],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.arbiterOfAuthority);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.clickPrompt('Yes');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.shomon);
                expect(this.mirumotoRaitsugu.isDishonored).toBe(false);
                expect(this.shomon.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePrompt('Honor Bid');
            });
        });
    });
});
