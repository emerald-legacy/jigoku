import { gainAbility } from '../../../build/server/game/Effects/Library/gainAbility.js';

describe('playOnlyIf', function() {
    integration(function() {
        describe('on an event played by the opponent', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['asahina-storyteller', 'brash-samurai'],
                        hand: ['the-mirror-s-gaze']
                    },
                    player2: {
                        honor: 8,
                        inPlay: ['seppun-guardsman'],
                        hand: ['blackmail']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.guardsman = this.player2.findCardByName('seppun-guardsman');
                this.mirrorGaze = this.player1.playAttachment('the-mirror-s-gaze', 'asahina-storyteller');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brash],
                    defenders: [this.guardsman]
                });
            });

            it('still applies when The Mirror\'s Gaze ignores triggering conditions', function() {
                this.player2.clickCard('blackmail');
                this.player2.clickCard(this.brash);
                expect(this.brash.controller).toBe(this.player2.player);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('on an ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
            });

            it('is rejected on a card that is not an event', function() {
                expect(() => this.whisperer.declareAbilities(() => {
                    this.whisperer.action('Test').playOnlyIf(() => true).draw();
                })).toThrowError('Test: playOnlyIf() on an ability is for events; other cards call this.playOnlyIf()');
            });

            it('is rejected on a gained ability', function() {
                expect(() => gainAbility.action('Test', (ability) => ability.playOnlyIf(() => true).draw()))
                    .toThrowError('Test: a gained ability can\'t restrict playing the card');
            });
        });
    });
});
