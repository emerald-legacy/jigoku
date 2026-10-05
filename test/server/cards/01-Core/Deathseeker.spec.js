describe('Deathseeker', function() {
    integration(function() {
        describe('Deathseeker/Shosuro Actress interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-actress']
                    },
                    player2: {
                        inPlay: ['akodo-toturi'],
                        dynastyDiscard: ['deathseeker']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['shosuro-actress'],
                    defenders: ['akodo-toturi']
                });
                this.deathseeker = this.player2.findCardByName('deathseeker');
                this.akodoToturi = this.player2.findCardByName('akodo-toturi');
                this.akodoToturi.fate = 1;
                this.player2.pass();
            });

            describe('When Actress brings Deathseeker into play', function() {
                beforeEach(function() {
                    this.player1.clickCard('shosuro-actress');
                    this.player1.clickCard(this.deathseeker);
                });

                it('should bring Deathseeker into the conflict', function() {
                    expect(this.deathseeker.location).toBe('play area');
                    expect(this.deathseeker.controller).toBe(this.player1.player);
                    expect(this.deathseeker.inConflict).toBe(true);
                });

                describe('and Deathseeker\'s ability triggers', function() {
                    beforeEach(function() {
                        this.noMoreActions();
                    });

                    it('should prompt the player', function() {
                        expect(this.player1).toHavePrompt('Triggered Abilities');
                        expect(this.player1).toBeAbleToSelect(this.deathseeker);
                    });

                    it('should be able to target Toturi', function() {
                        this.player1.clickCard(this.deathseeker);
                        expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                    });

                    it('should remove 1 fate from Toturi when clicked', function() {
                        this.player1.clickCard(this.deathseeker);
                        this.player1.clickCard(this.akodoToturi);
                        expect(this.deathseeker.location).toBe('dynasty discard pile');
                        expect(this.akodoToturi.fate).toBe(0);
                    });
                });
            });
        });

        describe('Deathseeker\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['deathseeker']
                    },
                    player2: {
                        inPlay: ['akodo-toturi', 'doji-kuwanan']
                    }
                });
                this.deathseeker = this.player1.findCardByName('deathseeker');
                this.akodoToturi = this.player2.findCardByName('akodo-toturi');
                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.kuwanan.fate = 2;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.deathseeker],
                    defenders: [this.akodoToturi]
                });
                this.noMoreActions();
            });

            it('should discard a character with no fate', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.deathseeker);
                this.player1.clickCard(this.akodoToturi);
                expect(this.deathseeker.location).toBe('dynasty discard pile');
                expect(this.akodoToturi.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player1 uses Deathseeker, sacrificing Deathseeker to discard Akodo Toturi');
            });

            it('should remove 1 fate from a character with fate', function() {
                this.player1.clickCard(this.deathseeker);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.location).toBe('play area');
                expect(this.kuwanan.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 uses Deathseeker, sacrificing Deathseeker to remove 1 fate from Doji Kuwanan');
            });
        });
    });
});
