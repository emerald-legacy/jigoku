import { breakProvince } from '../../../../build/server/game/GameActions/GameActions.js';

describe('Moto Chagatai', function() {
    integration(function() {
        describe('Moto Chagatai\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['moto-chagatai', 'shrine-maiden'],
                        hand:[]
                    },
                    player2: {
                        inPlay: ['steward-of-law'],
                        hand: ['for-shame', 'talisman-of-the-sun'],
                        provinces: ['public-forum', 'endless-plains', 'fertile-fields']
                    }
                });

                this.chagatai = this.player1.findCardByName('moto-chagatai');
                this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
                this.steward = this.player2.findCardByName('steward-of-law');

                this.endlessPlains = this.player2.findCardByName('endless-plains');
                this.publicForum = this.player2.findCardByName('public-forum');
                this.fertileFields = this.player2.findCardByName('fertile-fields');

                this.noMoreActions();
            });

            it('should prevent chagatai if a province is broken on attack', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.fertileFields,
                    attackers: [this.chagatai],
                    defenders: [this.steward],
                    jumpTo: 'afterConflict'
                });

                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.chagatai.bowed).toBe(false);
                expect(this.fertileFields.isBroken).toBe(true);
            });

            it('should bow chagatai if a province is not broken on attack', function() {
                this.initiateConflict({
                    type: 'political',
                    province: this.fertileFields,
                    attackers: [this.chagatai],
                    defenders: [this.steward],
                    jumpTo: 'afterConflict'
                });

                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.chagatai.bowed).toBe(true);
                expect(this.fertileFields.isBroken).toBe(false);
            });


            it('should not trigger if public forum is used', function () {
                this.initiateConflict({
                    type: 'military',
                    province: this.publicForum,
                    attackers: [this.chagatai],
                    defenders: [this.steward],
                    jumpTo: 'afterConflict'
                });

                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.publicForum);
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.chagatai.bowed).toBe(true);
                expect(this.publicForum.isBroken).toBe(false);
            });

            it('should work if a opponent uses endless plains and moves the conflict', function () {
                this.initiateConflict({
                    type: 'political',
                    province: this.endlessPlains,
                    attackers: [this.chagatai, this.shrineMaiden]
                });

                this.player2.clickCard(this.endlessPlains);
                this.player1.clickPrompt('Yes');
                this.player1.clickCard(this.shrineMaiden);
                this.player2.clickCard(this.steward);
                this.player2.clickPrompt('Done');
                this.player2.playAttachment('talisman-of-the-sun', this.steward);
                this.player1.pass();
                this.player2.clickCard('talisman-of-the-sun');
                this.player2.clickCard(this.publicForum);
                this.player1.pass();
                this.player2.pass();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.chagatai.bowed).toBe(false);
                expect(this.endlessPlains.isBroken).toBe(true);
                expect(this.publicForum.isBroken).toBe(false);
            });
        });
        describe('Moto Chagatai\'s ability after a province was broken outside a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-chagatai']
                    },
                    player2: {
                        inPlay: ['steward-of-law'],
                        provinces: ['public-forum', 'endless-plains', 'fertile-fields']
                    }
                });

                this.chagatai = this.player1.findCardByName('moto-chagatai');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.endlessPlains = this.player2.findCardByName('endless-plains');
                this.fertileFields = this.player2.findCardByName('fertile-fields');
            });

            it('should bow chagatai in a conflict that breaks nothing', function() {
                expect(this.game.currentConflict).toBeNull();
                this.game.queueSimpleStep(() => breakProvince().resolve(this.endlessPlains, this.game.getFrameworkContext(this.player1.player)));
                this.game.continue();
                expect(this.endlessPlains.isBroken).toBe(true);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    province: this.fertileFields,
                    attackers: [this.chagatai],
                    defenders: [this.steward],
                    jumpTo: 'afterConflict'
                });

                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.fertileFields.isBroken).toBe(false);
                expect(this.chagatai.bowed).toBe(true);
            });
        });

        describe('Moto Chagatai\'s ability and Join the Fray\'ed to the attacking opponent', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['shrine-maiden'],
                        hand: ['join-the-fray'],
                        dynastyDiscard: ['moto-chagatai']
                    }
                });

                this.steward = this.player1.findCardByName('steward-of-law');
                this.chagatai = this.player2.placeCardInProvince('moto-chagatai', 'province 1');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.jtf = this.player2.findCardByName('join-the-fray');

                this.noMoreActions();
            });

            it('should not keep Chagatai standing as he is controlled by the Unicorn player still', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.steward],
                    defenders: []
                });

                this.player2.clickCard(this.jtf);
                this.player2.clickCard(this.chagatai);
                this.player2.clickPrompt('player1');

                this.noMoreActions();
                this.player1.clickPrompt('no');
                this.player1.clickPrompt('don\'t resolve');
                expect(this.getChatLogs(5)).toContain('player1 has broken Shameful Display!');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.chagatai.bowed).toBe(true);
            });
        });

        describe('Moto Chagatai\'s ability while defending', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-chagatai']
                    },
                    player2: {
                        inPlay: ['steward-of-law']
                    }
                });

                this.chagatai = this.player1.findCardByName('moto-chagatai');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.attackerProvince = this.player2.findCardByName('shameful-display', 'province 1');
            });

            it('does not bow when a province of the attacking opponent was broken in the conflict', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.steward],
                    defenders: [this.chagatai]
                });
                this.game.queueSimpleStep(() => breakProvince().resolve(this.attackerProvince, this.game.getFrameworkContext(this.player1.player)));
                this.game.continue();
                this.player2.clickPrompt('No');
                expect(this.attackerProvince.isBroken).toBe(true);

                this.noMoreActions();
                expect(this.chagatai.bowed).toBe(false);
            });
        });
    });
});
