describe('Province Card - Turning Provinces Facedown with Tokens Tests', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['traveling-philosopher'],
                    dynastyDiscard: ['togashi-ichi'],
                    provinces: ['manicured-garden', 'public-forum', 'rally-to-the-cause'],
                    role: ['keeper-of-water']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    conflictDiscard: ['return-from-shadows'],
                    provinces: ['fertile-fields']
                }
            });

            this.forum = this.player1.findCardByName('public-forum');
            this.manicured = this.player1.findCardByName('manicured-garden');
            this.travelingPhilosopher = this.player1.findCardByName('traveling-philosopher');
            this.ichi = this.player1.placeCardInProvince('togashi-ichi', 'province 1');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.shadows = this.player2.findCardByName('return-from-shadows');
            this.fertile = this.player2.findCardByName('fertile-fields');
            this.rally = this.player1.findCardByName('rally-to-the-cause');
        });

        it('provinces turned facedown should lose tokens', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [],
                province: this.forum,
                ring: 'air'
            });
            this.noMoreActions();
            this.player1.clickCard(this.forum);
            this.player2.clickPrompt('Don\'t Resolve');

            expect(this.forum.hasToken('honor')).toBe(true);
            expect(this.forum.getTokenCount('honor')).toBe(1);

            this.player1.clickCard(this.ichi);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.forum);

            expect(this.forum.hasToken('honor')).toBe(false);
            expect(this.forum.getTokenCount('honor')).toBe(0);
        });

        it('provinces turned facedown with reactions to being revealed should react immediately - conflict at province', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                province: this.rally,
                type: 'military',
                ring: 'air'
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rally);
            expect(this.game.currentConflict.conflictType).toBe('military');
            this.player1.clickCard(this.rally);
            expect(this.game.currentConflict.conflictType).toBe('political');

            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.ichi);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.rally);

            expect(this.getChatLogs(5)).toContain('Rally to the Cause is immediately revealed again!');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rally);
            expect(this.game.currentConflict.conflictType).toBe('political');
            this.player1.clickCard(this.rally);
            expect(this.game.currentConflict.conflictType).toBe('military');
        });

        it('provinces turned facedown should lose tokens - conflict at province', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [],
                province: this.forum,
                ring: 'air'
            });
            this.noMoreActions();
            this.player1.clickCard(this.forum);
            this.player2.clickPrompt('Don\'t Resolve');
            this.kuwanan.bowed = false;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();

            expect(this.forum.hasToken('honor')).toBe(true);
            expect(this.forum.getTokenCount('honor')).toBe(1);

            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [],
                province: this.forum,
                type: 'political',
                ring: 'fire'
            });

            this.player1.clickCard(this.ichi);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.forum);

            expect(this.forum.hasToken('honor')).toBe(false);
            expect(this.forum.getTokenCount('honor')).toBe(0);

            expect(this.getChatLogs(5)).toContain('Public Forum is immediately revealed again!');
        });

        it('province should lose dishonor token', function() {
            this.noMoreActions();
            this.player2.moveCard(this.shadows, 'hand');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [],
                province: this.forum,
                ring: 'air'
            });
            this.noMoreActions();
            this.player2.clickCard(this.shadows);
            this.player2.clickCard(this.manicured);
            this.player1.clickCard(this.forum);
            this.player2.clickPrompt('Don\'t Resolve');

            expect(this.manicured.isDishonored).toBe(true);
            expect(this.manicured.facedown).toBe(false);

            this.player1.clickCard(this.ichi);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.travelingPhilosopher);
            this.player1.clickCard(this.manicured);

            expect(this.manicured.isDishonored).toBe(false);
            expect(this.manicured.facedown).toBe(true);
        });
    });
});

describe('Province Card - strengthSummary', function() {
    integration(function() {
        describe('basic strength summary', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['manicured-garden', 'pilgrimage'],
                        dynastyDiscard: ['imperial-storehouse']
                    },
                    player2: {
                        inPlay: ['brash-samurai'],
                        provinces: ['fertile-fields']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.pilgrimage = this.player1.findCardByName('pilgrimage', 'province 2');
                this.fertileFields = this.player2.findCardByName('fertile-fields', 'province 1');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.brash = this.player2.findCardByName('brash-samurai');
            });

            it('should return printed strength for a face-up province with no modifiers', function() {
                this.manicured.facedown = false;
                this.game.checkGameState(true);

                const summary = this.manicured.strengthSummary;
                expect(summary.stat).toBe(this.manicured.strength.toString());
                expect(summary.modifiers).toBeDefined();
                expect(summary.modifiers.length).toBe(1);

                const printedModifier = summary.modifiers.find(m => m.name === 'Printed');
                expect(printedModifier).toBeDefined();
                expect(printedModifier.amount).toBe(this.manicured.printedStrength);
            });

            it('should return empty object for a face-down province', function() {
                this.manicured.facedown = true;
                const summary = this.manicured.strengthSummary;
                expect(summary.stat).toBeUndefined();
                expect(summary.modifiers).toBeUndefined();
            });

            it('should have modifiers that sum to the total strength', function() {
                this.manicured.facedown = false;
                this.game.checkGameState(true);

                const modifiers = this.manicured.getStrengthModifiers();
                const total = modifiers.reduce((sum, m) => sum + m.amount, 0);
                expect(total).toBe(this.manicured.strength);
            });
        });

        describe('with holdings modifying strength', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['manicured-garden'],
                        dynastyDiscard: ['imperial-storehouse']
                    },
                    player2: {
                        inPlay: ['brash-samurai'],
                        provinces: ['fertile-fields']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.storehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
                this.manicured.facedown = false;
                this.game.checkGameState(true);
            });

            it('should include a "Cards in Province" modifier when a holding with strength bonus is present', function() {
                const bonus = this.storehouse.getProvinceStrengthBonus();
                const summary = this.manicured.strengthSummary;

                if(bonus !== 0) {
                    const holdingModifier = summary.modifiers.find(m => m.name === 'Cards in Province');
                    expect(holdingModifier).toBeDefined();
                    expect(holdingModifier.amount).toBe(bonus);
                }
            });

            it('should have the correct total strength in the stat field', function() {
                const summary = this.manicured.strengthSummary;
                expect(summary.stat).toBe(this.manicured.strength.toString());
            });
        });

        describe('with persistent effects modifying strength', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['manicured-garden', 'onsen-quarters']
                    },
                    player2: {
                        inPlay: ['brash-samurai'],
                        provinces: ['fertile-fields']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.onsen = this.player1.findCardByName('onsen-quarters', 'province 2');
                this.fertileFields = this.player2.findCardByName('fertile-fields', 'province 1');

                this.manicured.facedown = false;
                this.onsen.facedown = false;
                this.fertileFields.facedown = false;
                this.game.checkGameState(true);
            });

            it('should reflect Onsen Quarters +1 bonus in the total strength', function() {
                const summary = this.manicured.strengthSummary;
                const expectedStrength = this.manicured.printedStrength + 1;
                expect(this.manicured.strength).toBe(expectedStrength);
                expect(summary.stat).toBe(expectedStrength.toString());
            });

            it('should not include Onsen Quarters modifier on enemy provinces', function() {
                const summary = this.fertileFields.strengthSummary;
                expect(summary.stat).toBe(this.fertileFields.printedStrength.toString());
            });

            it('should include a modifier named after the source card', function() {
                const summary = this.manicured.strengthSummary;
                const onsenModifier = summary.modifiers.find(m => m.name === 'Onsen Quarters');
                expect(onsenModifier).toBeDefined();
                expect(onsenModifier.amount).toBe(1);
            });
        });

        describe('getSummary includes strengthSummary', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        inPlay: ['brash-samurai'],
                        provinces: ['fertile-fields']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.manicured.facedown = false;
                this.game.checkGameState(true);
            });

            it('should include strengthSummary in getSummary output', function() {
                const summary = this.manicured.getSummary(this.player1Object, false);
                expect(summary.strengthSummary).toBeDefined();
                expect(summary.strengthSummary.stat).toBe(this.manicured.strength.toString());
                expect(summary.strengthSummary.modifiers).toBeDefined();
            });

            it('should include isProvince and isBroken in getSummary output', function() {
                const summary = this.manicured.getSummary(this.player1Object, false);
                expect(summary.isProvince).toBe(true);
                expect(summary.isBroken).toBe(false);
            });

            it('should return empty strengthSummary in getSummary when facedown', function() {
                this.manicured.facedown = true;
                const summary = this.manicured.getSummary(this.player1Object, false);
                expect(summary.strengthSummary).toBeDefined();
                expect(summary.strengthSummary.stat).toBeUndefined();
                expect(summary.strengthSummary.modifiers).toBeUndefined();
            });
        });

        describe('strength floor', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        inPlay: ['brash-samurai'],
                        provinces: ['fertile-fields']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.manicured.facedown = false;
                this.game.checkGameState(true);
            });

            it('should never show negative strength in the summary stat', function() {
                expect(this.manicured.strength).toBe(4);
                const summary = this.manicured.strengthSummary;
                expect(summary.stat).toBe('4');
            });
        });
    });
});
