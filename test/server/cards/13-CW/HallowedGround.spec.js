describe('Hallowed Ground', function() {
    integration(function() {
        describe('Hallowed Grounds\' fire ring ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['hallowed-ground']
                    },
                    player2: {
                        hand: ['steward-of-law']
                    }
                });
                this.player1.placeCardInProvince('hallowed-ground', 'province 1');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.player1.pass();
            });

            it('it should not do anything if the opponent does not have the fire ring', function() {
                this.player2.clickCard(this.steward);
                expect(this.player2).toHavePrompt('Steward of Law');
                this.player2.clickPrompt('1');
                expect(this.steward.fate).toBe(1);
            });

            it('should stop the player if they have the fire ring', function() {
                this.player2.claimRing('fire');
                this.game.checkGameState(true);
                this.player2.clickCard(this.steward);
                expect(this.player2).toHavePromptButton('0');
                expect(this.player2).not.toHavePromptButton('1');
                this.player2.clickPrompt('0');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.steward.fate).toBe(0);
            });
        });

        describe('Hallowed Grounds\' air ring ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden', 'shadowlands-hunter'],
                        dynastyDiscard: ['hallowed-ground']
                    },
                    player2: {
                        inPlay: ['righteous-magistrate', 'solemn-scholar'],
                        honor: 11
                    }
                });
                this.player1.placeCardInProvince('hallowed-ground', 'province 1');
                this.maiden = this.player1.findCardByName('shrine-maiden');
                this.hunter = this.player1.findCardByName('shadowlands-hunter');

                this.magistrate = this.player2.findCardByName('righteous-magistrate');
                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.startingHonor = this.player2.honor;
                this.noMoreActions();
            });

            it('it should not do anything if the opponent does not have the air ring', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.maiden],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player2.honor).toBe(this.startingHonor - 1);
            });

            it('it should cause one more honor lost if they have the air ring', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.maiden],
                    defenders: []
                });
                this.player2.claimRing('air');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.getChatLogs(3)).toContain('player2 loses 1 honor due to the constant effect of Hallowed Ground');
                expect(this.player2.honor).toBe(this.startingHonor - 2);
            });

            it('should not working if righteous magistrate is defending', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.maiden, this.hunter],
                    defenders: [this.magistrate]
                });
                this.player2.claimRing('air');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player2.honor).toBe(this.startingHonor);
            });

            it('should cause honor loses for multiple conflict', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.hunter],
                    defenders: [this.scholar]
                });
                this.player2.claimRing('air');
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');

                this.noMoreActions();
                this.player2.clickPrompt('Pass Conflict');
                this.player2.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'political',
                    attackers: [this.maiden],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Earth Ring');
                expect(this.player2.honor).toBe(this.startingHonor - 4);
            });
        });
    });
});

describe('Hallowed Ground\'s earth ring ability', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shrine-maiden'],
                    dynastyDiscard: ['hallowed-ground']
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'doji-challenger']
                }
            });
            this.player1.placeCardInProvince('hallowed-ground', 'province 1');
            this.province2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
        });

        const breakProvince = function(spec) {
            spec.initiateConflict({
                ring: 'void',
                type: 'military',
                province: spec.province2,
                attackers: [spec.toshimoko, spec.challenger],
                defenders: []
            });
            spec.noMoreActions();
            spec.player2.clickPrompt('No');
        };

        it('lets the opponent claim the ring without the earth ring', function() {
            breakProvince(this);
            expect(this.province2.isBroken).toBe(true);
            expect(this.game.rings.void.claimedBy).toBe('player2');
        });

        it('stops the opponent from claiming the ring of a conflict in which they broke a province', function() {
            this.player2.claimRing('earth');
            breakProvince(this);
            expect(this.province2.isBroken).toBe(true);
            expect(this.game.rings.void.claimedBy).not.toBe('player2');
        });
    });
});

