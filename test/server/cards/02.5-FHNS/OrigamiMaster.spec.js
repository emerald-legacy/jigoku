describe('Origami Master', function() {
    integration(function() {
        describe('Origami Master\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['origami-master', 'miya-mystic', 'adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.origamiMaster = this.player1.findCardByName('origami-master');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.origamiMaster.honor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['origami-master'],
                    defenders: []
                });
            });

            it('should not allow selecting self as target', function() {
                this.player2.pass();
                this.player1.clickCard(this.origamiMaster);
                expect(this.player1).not.toBeAbleToSelect(this.origamiMaster);
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
            });

            it('should move the honored status token to another character', function() {
                this.player2.pass();
                this.player1.clickCard(this.origamiMaster);
                this.player1.clickCard(this.miyaMystic);
                expect(this.origamiMaster.isHonored).toBe(false);
                expect(this.miyaMystic.isHonored).toBe(true);
            });
        });

        describe('Origami Master and the recipient\'s status (ruling #241)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            { card: 'origami-master', honor: 'honored' },
                            { card: 'doji-whisperer', honor: 'honored' },
                            { card: 'miya-mystic', honor: 'dishonored' },
                            'savvy-politician',
                            'kakita-asami'
                        ]
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.origamiMaster = this.player1.findCardByName('origami-master');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.savvyPolitician = this.player1.findCardByName('savvy-politician');
                this.asami = this.player1.findCardByName('kakita-asami');
                this.borderRider = this.player2.findCardByName('border-rider');
            });

            it('cannot choose an honored character (ruling #241)', function() {
                this.player1.clickCard(this.origamiMaster);
                expect(this.player1).toHavePrompt('Origami Master');
                expect(this.player1).toBeAbleToSelect(this.asami);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
            });

            it('discards both tokens when moved to a dishonored character (ruling #241)', function() {
                this.player1.clickCard(this.origamiMaster);
                this.player1.clickCard(this.miyaMystic);
                expect(this.origamiMaster.isHonored).toBe(false);
                expect(this.miyaMystic.isHonored).toBe(false);
                expect(this.miyaMystic.isDishonored).toBe(false);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('does not count as honoring the recipient (ruling #241)', function() {
                this.player1.clickCard(this.origamiMaster);
                this.player1.clickCard(this.savvyPolitician);
                expect(this.savvyPolitician.isHonored).toBe(true);
                expect(this.origamiMaster.isHonored).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('cannot be used while it is not honored', function() {
                this.origamiMaster.makeOrdinary();
                this.origamiMaster.dishonor();
                expect(this.origamiMaster.isDishonored).toBe(true);
                this.player1.clickCard(this.origamiMaster);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.origamiMaster.isDishonored).toBe(true);
                expect(this.player1).not.toBeAbleToSelect(this.asami);
                expect(this.asami.isHonored).toBe(false);
                expect(this.whisperer.isHonored).toBe(true);
            });
        });
    });
});
