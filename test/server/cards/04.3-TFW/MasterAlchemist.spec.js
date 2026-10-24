describe('Master Alchemist', function() {
    integration(function() {
        describe('Master Alchemist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-alchemist', 'serene-warrior']
                    },
                    player2: {
                        provinces: ['kuroi-mori'],
                        hand: ['know-the-world'],
                        inPlay: ['serene-warrior']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'kuroi-mori',
                    attackers: ['serene-warrior'],
                    defenders: []
                });
                this.player2.claimRing('earth');
                this.sereneWarrior = this.player1.findCardByName('serene-warrior');
            });

            it('should cost 1 fate', function() {
                this.player2.pass();
                const fate = this.player1.fate;
                this.player1.clickCard('master-alchemist');
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                this.player1.clickCard('serene-warrior');
                this.player1.clickPrompt('Honor this character');
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.sereneWarrior.isHonored).toBe(true);
            });

            it('should place 1 fate on Fire ring', function() {
                this.player2.pass();
                const fate = this.game.rings.fire.fate;
                this.player1.clickCard('master-alchemist');
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                this.player1.clickCard('serene-warrior');
                this.player1.clickPrompt('Honor this character');
                expect(this.game.rings.fire.fate).toBe(fate + 1);
            });

            it('should place 1 fate on Fire ring, even if it is contested', function() {
                this.player2.clickCard('kuroi-mori');
                this.player2.clickPrompt('Switch the contested ring');
                this.player2.clickRing('fire');
                expect(this.game.currentConflict.ring).toBe(this.game.rings.fire);
                const fate = this.game.rings.fire.fate;
                this.player1.clickCard('master-alchemist');
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                this.player1.clickCard('serene-warrior');
                this.player1.clickPrompt('Honor this character');
                expect(this.game.rings.fire.fate).toBe(fate + 1);
            });

            it('should place 1 fate on Fire ring, even if it is claimed', function() {
                this.player2.clickCard('know-the-world');
                this.player2.clickRing('earth');
                this.player2.clickRing('fire');
                expect(this.game.rings.fire.claimedBy).toBe(this.player2.player.name);
                const fate = this.game.rings.fire.fate;
                this.player1.clickCard('master-alchemist');
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                this.player1.clickCard('serene-warrior');
                this.player1.clickPrompt('Honor this character');
                expect(this.game.rings.fire.fate).toBe(fate + 1);
            });

            it('should be able to honor chosen character', function() {
                this.player2.pass();
                expect(this.sereneWarrior.isHonored).toBe(false);
                this.player1.clickCard('master-alchemist');
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                this.player1.clickCard('serene-warrior');
                this.player1.clickPrompt('Honor this character');
                expect(this.sereneWarrior.isHonored).toBe(true);
            });

            it('should be able to dishonor chosen character', function() {
                this.player2.pass();
                const sereneWarrior = this.player1.findCardByName('serene-warrior');
                expect(sereneWarrior.isDishonored).toBe(false);
                this.player1.clickCard('master-alchemist');
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                this.player1.clickCard('serene-warrior');
                this.player1.clickPrompt('Dishonor this character');
                expect(sereneWarrior.isDishonored).toBe(true);
            });
        });

        describe('interaction with{ Young Rumormonger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-alchemist', 'togashi-mitsu']
                    },
                    player2: {
                        inPlay: ['young-rumormonger', 'bayushi-liar']
                    }
                });

                this.togashiMitsu = this.player1.findCardByName('togashi-mitsu');
                this.togashiMitsu.dishonor();
                this.youngRumormonger = this.player2.findCardByName('young-rumormonger');

                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.togashiMitsu]
                });
                this.player1.clickCard(this.youngRumormonger);
                this.player2.clickPrompt('Done');

                this.player2.pass();
            });

            it('should allow Young Rumormonger to redirect honor', function() {
                this.masterAlchemist = this.player1.clickCard('master-alchemist');
                expect(this.player1).toHavePrompt('Master Alchemist');
                this.player1.clickCard(this.togashiMitsu);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Honor this character');
                expect(this.player2).toHavePrompt('Triggered Abilities');
            });
        });
    });
});

describe('Master Alchemist and an extra cost to target', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja', 'ikoma-prodigy'],
                    hand: ['to-show-the-path']
                },
                player2: {
                    inPlay: ['master-alchemist', 'serene-warrior']
                }
            });
            this.prodigy = this.player1.findCardByName('ikoma-prodigy');
            this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
            this.alchemist = this.player2.findCardByName('master-alchemist');
            this.sereneWarrior = this.player2.findCardByName('serene-warrior');
            this.player1.clickCard('to-show-the-path');
            this.player1.clickCard(this.prodigy);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.prodigy],
                defenders: [this.sereneWarrior]
            });
            this.player2.fate = 1;
        });

        it('counts the fate spent to the ring before offering targets', function() {
            this.player2.clickCard(this.alchemist);
            expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
            expect(this.player2).not.toBeAbleToSelect(this.prodigy);
        });
    });
});
