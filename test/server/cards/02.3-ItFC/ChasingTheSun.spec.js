describe('Chasing the Sun', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-hotaru', 'border-rider'],
                    hand: ['chasing-the-sun', 'ride-them-down']
                },
                player2: {
                    provinces: ['manicured-garden', 'fertile-fields', 'the-art-of-war', 'entrenched-position'],
                    dynastyDiscard: ['hito-district']
                }
            });

            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.rider = this.player1.findCardByName('border-rider');
            this.chasing = this.player1.findCardByName('chasing-the-sun');
            this.rideThemDown = this.player1.findCardByName('ride-them-down');

            this.garden = this.player2.findCardByName('manicured-garden', 'province 1');
            this.fields = this.player2.findCardByName('fertile-fields', 'province 2');
            this.artOfWar = this.player2.findCardByName('the-art-of-war', 'province 3');
            this.entrenched = this.player2.findCardByName('entrenched-position', 'province 4');
            this.strongholdProvince = this.player2.findCardByName(fillers.province, 'stronghold province');
            this.myProvince = this.player1.findCardByName(fillers.province, 'province 1');
        });

        it('should move the conflict to another eligible province and reveal it', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.garden,
                attackers: [this.rider],
                defenders: []
            });
            this.player2.pass();
            expect(this.fields.facedown).toBe(true);
            this.player1.clickCard(this.chasing);
            expect(this.player1).toHavePrompt('Chasing the Sun');
            expect(this.player1).toBeAbleToSelect(this.fields);
            expect(this.player1).toBeAbleToSelect(this.artOfWar);
            expect(this.player1).toBeAbleToSelect(this.entrenched);
            expect(this.player1).not.toBeAbleToSelect(this.garden);
            expect(this.player1).not.toBeAbleToSelect(this.myProvince);
            // ruling #243: the stronghold province is not eligible unless three other provinces are broken
            expect(this.player1).not.toBeAbleToSelect(this.strongholdProvince);
            this.player1.clickCard(this.fields);
            expect(this.game.currentConflict.conflictProvince).toBe(this.fields);
            expect(this.fields.inConflict).toBe(true);
            expect(this.garden.inConflict).toBe(false);
            expect(this.fields.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Chasing the Sun to move the conflict to another eligible province');
        });

        it('should make the new province the attacked province', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.garden,
                attackers: [this.rider, this.hotaru],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.chasing);
            this.player1.clickCard(this.fields);
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 5 vs 0');
            expect(this.fields.isBroken).toBe(true);
            expect(this.garden.isBroken).toBe(false);
        });

        // ruling #243: lasting effects on the previously attacked province do not carry over
        it('should not carry lasting effects over to the new province', function() {
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.garden,
                attackers: [this.rider],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.rideThemDown);
            expect(this.garden.getStrength()).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.chasing);
            this.player1.clickCard(this.fields);
            expect(this.fields.getStrength()).toBe(4);
        });

        it('should not be able to choose a broken province', function() {
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
            this.initiateConflict({
                type: 'military',
                ring: 'earth',
                province: this.fields,
                attackers: [this.rider],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.chasing);
            expect(this.player1).toHavePrompt('Chasing the Sun');
            expect(this.player1).not.toBeAbleToSelect(this.garden);
            expect(this.player1).toBeAbleToSelect(this.artOfWar);
        });

        // ruling #243: a province with Hito District is eligible during a political conflict
        it('should be able to move a political conflict to a province with Hito District', function() {
            this.hito = this.player2.placeCardInProvince('hito-district', 'province 2');
            this.hito.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                province: this.garden,
                attackers: [this.hotaru],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.chasing);
            expect(this.player1).toBeAbleToSelect(this.fields);
            this.player1.clickCard(this.fields);
            expect(this.game.currentConflict.conflictProvince).toBe(this.fields);
        });
    });
});

describe('Chasing the Sun as the defending player', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider'],
                    hand: ['chasing-the-sun']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });

            this.rider = this.player1.findCardByName('border-rider');
            this.chasing = this.player1.findCardByName('chasing-the-sun');
            this.brash = this.player2.findCardByName('brash-samurai');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.rider]
            });
        });

        it('should not be playable', function() {
            this.player1.clickCard(this.chasing);
            expect(this.chasing.location).toBe('hand');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.game.currentConflict.conflictProvince).toBe(this.player1.findCardByName(fillers.province, 'province 1'));
        });
    });
});
