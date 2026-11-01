describe('Seeking The Truth', function() {
    integration(function() {
        describe('Seeking The Truth\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        provinces: ['seeking-the-truth']
                    }
                });

                this.scout = this.player2.findCardByName('eager-scout');
                this.katana = this.player1.findCardByName('fine-katana');
                this.berserker = this.player1.findCardByName('matsu-berserker');

                this.noMoreActions();
            });

            it('should trigger when it is broken', function() {
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    type: 'military'
                });
                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard(this.katana);
                this.player1.clickCard('matsu-berserker');
                expect(this.berserker.militarySkill).toBe(5);
                this.player2.pass();
                this.player1.pass();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('seeking-the-truth');
            });

            it('should correctly target the defending character', function() {
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    type: 'military'
                });
                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard(this.katana);
                this.player1.clickCard('matsu-berserker');
                this.player2.pass();
                this.player1.pass();
                this.player2.clickCard('seeking-the-truth');
                expect(this.player2).toBeAbleToSelect('eager-scout');
            });

            it('should correctly send the defending character home', function() {
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    type: 'military'
                });
                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard(this.katana);
                this.player1.clickCard('matsu-berserker');
                this.player2.pass();
                this.player1.pass();
                this.player2.clickCard('seeking-the-truth');
                this.player2.clickCard('eager-scout');
                expect(this.scout.inConflict).toBe(false);
                expect(this.scout.bowed).toBe(false);
            });

        });
    });
});

describe('Seeking The Truth strength with a Water role', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    role: 'keeper-of-water',
                    provinces: ['seeking-the-truth']
                }
            });
            this.seekingTheTruth = this.player2.findCardByName('seeking-the-truth');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: ['matsu-berserker'],
                province: this.seekingTheTruth,
                defenders: []
            });
        });

        it('should get +2 strength', function() {
            expect(this.seekingTheTruth.facedown).toBe(false);
            expect(this.player2.player.role.id).toBe('keeper-of-water');
            expect(this.seekingTheTruth.getStrength()).toBe(5);
        });
    });
});

describe('Seeking The Truth strength without a Water role', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    role: 'keeper-of-earth',
                    provinces: ['seeking-the-truth']
                }
            });
            this.seekingTheTruth = this.player2.findCardByName('seeking-the-truth');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: ['matsu-berserker'],
                province: this.seekingTheTruth,
                defenders: []
            });
        });

        it('should keep its printed strength', function() {
            expect(this.seekingTheTruth.facedown).toBe(false);
            expect(this.player2.player.role.id).toBe('keeper-of-earth');
            expect(this.seekingTheTruth.getStrength()).toBe(3);
        });
    });
});
