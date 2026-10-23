describe('Master of Gisei Toshi', function() {
    integration(function() {
        describe('Master of Gisei Toshi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['master-of-gisei-toshi', 'seeker-of-knowledge'],
                        hand: ['court-games', 'supernatural-storm', 'banzai'],
                        dynastyDiscard: ['master-of-gisei-toshi']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['captive-audience', 'against-the-waves', 'tattooed-wanderer']
                    }
                });
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.masterOfGiseiToshi = this.player1.findCardByName('master-of-gisei-toshi', 'play area');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should trigger at the start of the conflict phase', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.masterOfGiseiToshi);
            });

            it('should stop both players from playing non-spell events during conflicts contesting the selected ring', function() {
                this.noMoreActions();
                this.player1.clickCard(this.masterOfGiseiToshi);
                expect(this.player1).toHavePrompt('Master of Gisei Toshi');
                this.player1.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'political',
                    attackers: [this.masterOfGiseiToshi],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('captive-audience');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.tattooedWanderer = this.player2.playCharacterFromHand('tattooed-wanderer');
                this.player2.clickPrompt('Conflict');
                expect(this.tattooedWanderer.inConflict).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('court-games');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('supernatural-storm');
                expect(this.player1).toHavePrompt('Supernatural Storm');
                this.player1.clickCard(this.masterOfGiseiToshi);
                expect(this.masterOfGiseiToshi.politicalSkill).toBe(6);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('against-the-waves');
                expect(this.player2).toHavePrompt('Against the Waves');
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.bowed).toBe(true);
            });

            it('should not stop players from playing non-spell events during conflicts contesting other rings', function() {
                this.noMoreActions();
                this.player1.clickCard(this.masterOfGiseiToshi);
                expect(this.player1).toHavePrompt('Master of Gisei Toshi');
                this.player1.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'water',
                    type: 'political',
                    attackers: [this.masterOfGiseiToshi],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('captive-audience');
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player1.clickCard('banzai');
                expect(this.player1).toHavePrompt('Banzai!');
            });

            it('should not interact with Seeker of Knowledge', function() {
                this.noMoreActions();
                this.player1.clickCard(this.masterOfGiseiToshi);
                expect(this.player1).toHavePrompt('Master of Gisei Toshi');
                this.player1.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'water',
                    type: 'political',
                    attackers: [this.masterOfGiseiToshi, 'seeker-of-knowledge'],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('captive-audience');
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player1.clickCard('banzai');
                expect(this.player1).toHavePrompt('Banzai!');
            });

            it('should work with multiple MoGTs', function() {
                this.masterOfGiseiToshi2 = this.player1.findCardByName('master-of-gisei-toshi', 'dynasty discard pile');
                this.player1.player.moveCard(this.masterOfGiseiToshi2, 'play area');
                this.noMoreActions();
                this.player1.clickCard(this.masterOfGiseiToshi);
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.masterOfGiseiToshi2);
                this.player1.clickCard(this.masterOfGiseiToshi2);
                this.player1.clickRing('earth');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.masterOfGiseiToshi],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('captive-audience');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.tattooedWanderer = this.player2.playCharacterFromHand('tattooed-wanderer');
                this.player2.clickPrompt('Conflict');
                expect(this.tattooedWanderer.inConflict).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('court-games');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('supernatural-storm');
                expect(this.player1).toHavePrompt('Supernatural Storm');
                this.player1.clickCard(this.masterOfGiseiToshi);
                expect(this.masterOfGiseiToshi.politicalSkill).toBe(7);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('against-the-waves');
                expect(this.player2).toHavePrompt('Against the Waves');
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.bowed).toBe(true);
            });
        });
    });
});

describe('Master of Gisei Toshi after its ring is claimed', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['master-of-gisei-toshi', 'doji-whisperer'],
                    hand: ['curry-favor']
                },
                player2: {
                    inPlay: ['adept-of-the-waves']
                }
            });
            this.master = this.player1.findCardByName('master-of-gisei-toshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
            this.player1.clickCard(this.master);
            this.player1.clickRing('fire');
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t resolve');
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                ring: 'fire',
                type: 'military',
                province: this.player2.findCardByName('shameful-display', 'province 2'),
                attackers: [this.master],
                defenders: []
            });
            this.noMoreActions();
        });

        it('lets players play events once the ring is no longer contested', function() {
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.game.rings.fire.isContested()).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect('curry-favor');
        });
    });
});
