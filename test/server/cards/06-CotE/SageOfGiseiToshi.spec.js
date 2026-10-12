import { ThenAbility } from '../../../../build/server/game/ThenAbility.js';
import { cardLastingEffect } from '../../../../build/server/game/GameActions/GameActions.js';
import { cardCannot } from '../../../../build/server/game/effects.js';

describe('Sage of Gisei Toshi', function() {
    integration(function() {
        describe('Sage of Gisei Toshi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['sage-of-gisei-toshi'],
                        honor: 11
                    },
                    player2: {
                        inPlay: ['doji-whisperer','savvy-politician'],
                        honor: 10
                    }
                });
                this.sageOfGiseiToshi = this.player1.findCardByName('sage-of-gisei-toshi');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.savvyPolitician = this.player2.findCardByName('savvy-politician');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.sageOfGiseiToshi);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.sageOfGiseiToshi],
                        defenders: [this.dojiWhisperer]
                    });
                });

                it('should not be able to be triggered if you have equal honor', function() {
                    this.player1.player.honor = 10;
                    this.player2.player.honor = 10;
                    this.player2.pass();
                    expect(this.player1.player.honor).toBe(this.player2.player.honor);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.sageOfGiseiToshi);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not be able to be triggered if you have fewer honor', function() {
                    this.player1.player.honor = 9;
                    this.player2.player.honor = 10;
                    this.player2.pass();
                    expect(this.player1.player.honor).toBeLessThan(this.player2.player.honor);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.sageOfGiseiToshi);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should prompt to select a participating character your opponent controls', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.sageOfGiseiToshi);
                    expect(this.player1).toHavePrompt('Choose a character');
                    expect(this.player1).not.toBeAbleToSelect(this.sageOfGiseiToshi);
                    expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player1).not.toBeAbleToSelect(this.savvyPolitician);
                });

                describe('if it resolves', function() {
                    beforeEach(function() {
                        this.player2.pass();
                        this.player1.clickCard(this.sageOfGiseiToshi);
                        this.player1.clickCard(this.dojiWhisperer);
                    });

                    it('should send itself home', function() {
                        expect(this.sageOfGiseiToshi.inConflict).toBe(false);
                    });

                    it('should send the target home', function() {
                        expect(this.dojiWhisperer.inConflict).toBe(false);
                    });
                });
            });
        });
    });
});

describe('Sage of Gisei Toshi when it cannot go home', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['sage-of-gisei-toshi'],
                    honor: 11
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    honor: 10
                }
            });
            this.sage = this.player1.findCardByName('sage-of-gisei-toshi');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.sage],
                defenders: [this.whisperer]
            });
            const context = new ThenAbility(this.whisperer, {}).createContext(this.player2.player);
            this.game.queueSimpleStep(() => cardLastingEffect({ effect: cardCannot('sendHome') }).resolve(this.sage, context));
            this.game.continue();
            this.player2.pass();
        });

        it('still moves the chosen character home ("Then" does not depend on the first part)', function() {
            this.player1.clickCard(this.sage);
            this.player1.clickCard(this.whisperer);
            expect(this.sage.isParticipating()).toBe(true);
            expect(this.whisperer.isParticipating()).toBe(false);
        });
    });
});

