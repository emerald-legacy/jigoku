import { StaticEffect } from '../../server/game/Effects/StaticEffect.js';
import { GainAbility } from '../../server/game/Effects/GainAbility.js';
import { EffectName, AbilityType } from '../../server/game/Constants.js';
import { GameObject } from '../../server/game/GameObject.js';
import { AbilityContext } from '../../server/game/AbilityContext.js';
import type DrawCard from '../../server/game/DrawCard.js';
import type Game from '../../server/game/Game.js';
import { createTestCharacter, createTestGame } from '../helpers/fixtures.js';

describe('StaticEffect', function() {
    let game: Game;
    let target: GameObject;

    beforeEach(function() {
        game = createTestGame();
        target = new GameObject(game, 'target');
        spyOn(target, 'addEffect');
        spyOn(target, 'removeEffect');
    });

    describe('getValue()', function() {
        it('should return the wrapped value', function() {
            const effect = new StaticEffect(EffectName.ModifyMilitarySkill, 5);
            expect(effect.getValue()).toBe(5);
        });
    });

    describe('context', function() {
        it('should be unset until setContext is called', function() {
            const effect = new StaticEffect(EffectName.ModifyMilitarySkill, 5);
            expect(effect.context).toBeUndefined();
        });

        it('should be assigned by setContext', function() {
            const effect = new StaticEffect(EffectName.ModifyMilitarySkill, 5);
            const context = new AbilityContext({ game });
            effect.setContext(context);
            expect(effect.context).toBe(context);
        });
    });

    describe('apply()', function() {
        it('should register itself on the target', function() {
            const effect = new StaticEffect(EffectName.ModifyMilitarySkill, 5);
            effect.apply(target);
            expect(target.addEffect).toHaveBeenCalledWith(effect);
        });
    });

    describe('unapply()', function() {
        it('should deregister itself from the target', function() {
            const effect = new StaticEffect(EffectName.ModifyMilitarySkill, 5);
            effect.unapply(target);
            expect(target.removeEffect).toHaveBeenCalledWith(effect);
        });
    });

    describe('persistent ability gain applied to multiple targets', function() {
        let target1: DrawCard;
        let target2: DrawCard;
        let copy1: GainAbility;
        let copy2: GainAbility;
        let gain: GainAbility;
        let effect: StaticEffect<EffectName.GainAbility, DrawCard>;

        beforeEach(function() {
            target1 = createTestCharacter(game, 'Target One');
            target2 = createTestCharacter(game, 'Target Two');
            for(const card of [target1, target2]) {
                spyOn(card, 'addEffect');
                spyOn(card, 'removeEffect');
            }

            gain = new GainAbility(AbilityType.Persistent, { effect: [] });
            copy1 = new GainAbility(AbilityType.Persistent, { effect: [] });
            copy2 = new GainAbility(AbilityType.Persistent, { effect: [] });
            for(const copy of [copy1, copy2]) {
                spyOn(copy, 'apply');
                spyOn(copy, 'unapply');
            }
            const copies = [copy1, copy2];
            let next = 0;
            spyOn(gain, 'getCopy').and.callFake(() => copies[next++]);

            effect = new StaticEffect(EffectName.GainAbility, gain);
            effect.apply(target1);
            effect.apply(target2);
        });

        it('applies an independent copy to each target', function() {
            expect(copy1.apply).toHaveBeenCalledWith(target1);
            expect(copy2.apply).toHaveBeenCalledWith(target2);
        });

        it('tears down only the removed target, leaving other targets intact', function() {
            effect.unapply(target1);
            expect(copy1.unapply).toHaveBeenCalledWith(target1);
            expect(copy2.unapply).not.toHaveBeenCalled();
        });
    });
});
