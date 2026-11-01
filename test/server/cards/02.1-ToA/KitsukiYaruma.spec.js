describe('Kitsuki Yaruma', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 10,
                    dynastyDeck: ['kitsuki-yaruma'],
                    provinces: ['manicured-garden', 'fertile-fields']
                },
                player2: {
                    provinces: ['manicured-garden', 'fertile-fields']
                }
            });

            this.yaruma = this.player1.placeCardInProvince('kitsuki-yaruma', 'province 1');
            this.yaruma.facedown = false;
            this.myGarden = this.player1.findCardByName('manicured-garden', 'province 1');
            this.theirGarden = this.player2.findCardByName('manicured-garden', 'province 1');
            this.theirFields = this.player2.findCardByName('fertile-fields', 'province 2');
            this.theirGarden.facedown = false;
            this.theirFields.facedown = false;
            this.myGarden.facedown = false;
        });

        it('should turn a chosen province facedown after it enters play', function() {
            this.player1.playFromProvinces('kitsuki-yaruma');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yaruma);
            this.player1.clickCard(this.yaruma);
            expect(this.player1).toBeAbleToSelect(this.theirGarden);
            expect(this.player1).toBeAbleToSelect(this.theirFields);
            expect(this.player1).toBeAbleToSelect(this.myGarden);
            this.player1.clickCard(this.theirGarden);
            expect(this.theirGarden.facedown).toBe(true);
            expect(this.theirFields.facedown).toBe(false);
            expect(this.myGarden.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Kitsuki Yaruma to turn Manicured Garden facedown');
        });

        it('should be able to turn its controller\'s own province facedown', function() {
            this.player1.playFromProvinces('kitsuki-yaruma');
            this.player1.clickCard(this.yaruma);
            this.player1.clickCard(this.myGarden);
            expect(this.myGarden.facedown).toBe(true);
            expect(this.theirGarden.facedown).toBe(false);
        });
    });
});

describe('Kitsuki Yaruma in play', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsuki-yaruma', 'doji-hotaru'],
                    hand: ['liquid-courage']
                }
            });

            this.yaruma = this.player1.findCardByName('kitsuki-yaruma');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.liquidCourage = this.player1.findCardByName('liquid-courage');
        });

        it('should not be able to have a Poison attachment', function() {
            this.player1.clickCard(this.liquidCourage);
            expect(this.player1).toHavePrompt('Liquid Courage');
            expect(this.player1).not.toBeAbleToSelect(this.yaruma);
            expect(this.player1).toBeAbleToSelect(this.hotaru);
            this.player1.clickCard(this.hotaru);
            expect(this.hotaru.attachments).toContain(this.liquidCourage);
        });
    });
});

describe('Kitsuki Yaruma in the conflict phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-hotaru', 'border-rider'],
                    dynastyDeck: ['kitsuki-yaruma'],
                    hand: ['charge']
                },
                player2: {
                    provinces: ['manicured-garden', 'fertile-fields', 'entrenched-position']
                }
            });

            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.rider = this.player1.findCardByName('border-rider');
            this.charge = this.player1.findCardByName('charge');
            this.garden = this.player2.findCardByName('manicured-garden', 'province 1');
            this.fields = this.player2.findCardByName('fertile-fields', 'province 2');
            this.entrenched = this.player2.findCardByName('entrenched-position', 'province 3');
        });

        describe('when it enters play during a conflict', function() {
            beforeEach(function() {
                this.yaruma = this.player1.placeCardInProvince('kitsuki-yaruma', 'province 1');
                this.yaruma.facedown = false;

                // break Manicured Garden with a political conflict first
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    province: this.garden,
                    attackers: [this.hotaru],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.garden.isBroken).toBe(true);
                this.player1.clickPrompt('Pass'); // Doji Hotaru's reaction
                // player2 has no characters, so their conflict opportunity is passed automatically
                this.noMoreActions();
                this.noMoreActions();

                this.fields.facedown = false;
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    province: this.entrenched,
                    attackers: [this.rider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.yaruma);
                expect(this.yaruma.isParticipating()).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.yaruma);
            });

            it('should not be able to choose a broken province', function() {
                expect(this.player1).not.toBeAbleToSelect(this.garden);
                expect(this.player1).toBeAbleToSelect(this.fields);
                expect(this.player1).toBeAbleToSelect(this.entrenched);
            });

            it('should turn a province other than the attacked one facedown', function() {
                this.player1.clickCard(this.fields);
                expect(this.fields.facedown).toBe(true);
            });

            // ruling #173: the attacked province turned facedown is immediately turned faceup again
            it('should turn the attacked province straight back faceup', function() {
                expect(this.entrenched.facedown).toBe(false);
                this.player1.clickCard(this.entrenched);
                expect(this.getChatLogs(5)).toContain('player1 uses Kitsuki Yaruma to turn Entrenched Position facedown');
                expect(this.entrenched.facedown).toBe(false);
                expect(this.game.currentConflict.conflictProvince).toBe(this.entrenched);
            });
        });
    });
});
