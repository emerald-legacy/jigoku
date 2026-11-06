import { ResolvableAbility } from '../../../build/server/game/ResolvableAbility.js';
import { playerLastingEffect } from '../../../build/server/game/GameActions/GameActions.js';
import { playerCannot } from '../../../build/server/game/effects.js';
import { PlayType } from '../../../build/server/game/Constants.js';

describe('playing a character from the dynasty deck (Agasha Ayako, play type Other)', function() {
    integration(function() {
        describe('with Shosuro Miyako in play', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['agasha-ayako'],
                        inPlay: ['border-rider', 'shosuro-miyako']
                    },
                    player2: {
                        hand: ['fine-katana', 'banzai']
                    }
                });
                this.miyako = this.player1.findCardByName('shosuro-miyako');
                this.ayako = this.player1.placeCardInProvince('agasha-ayako', 'province 1');
                this.ayako.facedown = false;
                this.borderRider = this.player1.moveCard('border-rider', 'dynasty deck');
            });

            it('is not a play from hand, so "after you play a character from your hand" does not trigger', function() {
                this.player1.clickCard(this.ayako);
                this.player1.clickPrompt('0');
                expect(this.player1).not.toBeAbleToSelect(this.miyako);
                this.player1.clickCard(this.ayako);
                this.player1.clickPrompt(this.borderRider.name);
                this.player1.clickPrompt('0');
                expect(this.borderRider.location).toBe('play area');
                expect(this.player1).not.toBeAbleToSelect(this.miyako);
            });
        });

        describe('while the player cannot play cards from hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['agasha-ayako'],
                        inPlay: ['border-rider']
                    }
                });
                this.ayako = this.player1.placeCardInProvince('agasha-ayako', 'province 1');
                this.ayako.facedown = false;
                this.borderRider = this.player1.moveCard('border-rider', 'dynasty deck');
                const context = new ResolvableAbility(this.ayako, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => playerLastingEffect({
                    effect: playerCannot({ cannot: PlayType.PlayFromHand })
                }).resolve(this.player1.player, context));
                this.game.continue();
            });

            it('still plays the searched character', function() {
                this.player1.clickCard(this.ayako);
                this.player1.clickPrompt('0');
                expect(this.ayako.location).toBe('play area');
                this.player1.clickCard(this.ayako);
                this.player1.clickPrompt(this.borderRider.name);
                this.player1.clickPrompt('0');
                expect(this.borderRider.location).toBe('play area');
            });
        });
    });
});
