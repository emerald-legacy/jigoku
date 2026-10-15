import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import { cardLastingEffect, sacrifice } from '../../../build/server/game/GameActions/GameActions.js';
import { gainAbility, loseGainedAbilities, modifyMilitarySkill } from '../../../build/server/game/effects.js';
import { AbilityType } from '../../../build/server/game/Constants.js';

describe('Losing gained abilities', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'bayushi-liar']
                }
            });

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.liar = this.player1.findCardByName('bayushi-liar');

            this.applyEffect = (card, effect) => {
                const context = new ThenAbility(card, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => cardLastingEffect({ duration: 'untilEndOfRound', effect }).resolve(card, context));
                this.game.continue();
            };
        });

        it('switches off a gained constant ability', function () {
            this.applyEffect(this.berserker, gainAbility(AbilityType.Persistent, { effect: modifyMilitarySkill(2) }));
            expect(this.berserker.militarySkill).toBe(5);

            this.applyEffect(this.berserker, loseGainedAbilities());
            expect(this.berserker.militarySkill).toBe(3);
        });

        it('keeps printed keywords', function () {
            this.applyEffect(this.liar, loseGainedAbilities());
            expect(this.liar.hasSincerity()).toBe(true);
        });

        it('keeps printed keyword abilities working', function () {
            this.applyEffect(this.liar, loseGainedAbilities());
            const hand = this.player1.hand.length;
            const context = new ThenAbility(this.berserker, {}).createContext(this.player1.player);
            this.game.queueSimpleStep(() => sacrifice().resolve(this.liar, context));
            this.game.continue();
            expect(this.liar.location).toBe('dynasty discard pile');
            expect(this.player1.hand.length).toBe(hand + 1);
        });
    });
});
