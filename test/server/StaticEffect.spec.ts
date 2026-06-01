import StaticEffect from '../../server/game/Effects/StaticEffect.js';
import GainAbility from '../../server/game/Effects/GainAbility.js';
import { EffectNames, AbilityTypes } from '../../server/game/Constants.js';

describe('StaticEffect', function() {
    let target: jasmine.SpyObj<{ addEffect: (e: unknown) => void; removeEffect: (e: unknown) => void }>;

    beforeEach(function() {
        target = jasmine.createSpyObj('target', ['addEffect', 'removeEffect']);
    });

    describe('getValue()', function() {
        it('should return the wrapped value', function() {
            const effect = new StaticEffect(EffectNames.ModifyMilitarySkill, 5);
            expect(effect.getValue()).toBe(5);
        });
    });

    describe('context', function() {
        it('should be unset until setContext is called', function() {
            const effect = new StaticEffect(EffectNames.ModifyMilitarySkill, 5);
            expect(effect.context).toBeUndefined();
        });

        it('should be assigned by setContext', function() {
            const effect = new StaticEffect(EffectNames.ModifyMilitarySkill, 5);
            const context = { name: 'ctx' };
            effect.setContext(context as never);
            expect(effect.context).toBe(context as never);
        });
    });

    describe('apply()', function() {
        it('should register itself on the target', function() {
            const effect = new StaticEffect(EffectNames.ModifyMilitarySkill, 5);
            effect.apply(target as never);
            expect(target.addEffect).toHaveBeenCalledWith(effect);
        });
    });

    describe('unapply()', function() {
        it('should deregister itself from the target', function() {
            const effect = new StaticEffect(EffectNames.ModifyMilitarySkill, 5);
            effect.unapply(target as never);
            expect(target.removeEffect).toHaveBeenCalledWith(effect);
        });
    });

    describe('persistent ability gain applied to multiple targets', function() {
        let target1: any;
        let target2: any;
        let copy1: jasmine.SpyObj<{ apply: (t: unknown) => void; unapply: (t: unknown) => void }>;
        let copy2: jasmine.SpyObj<{ apply: (t: unknown) => void; unapply: (t: unknown) => void }>;
        let gain: GainAbility;
        let effect: StaticEffect;

        beforeEach(function() {
            target1 = jasmine.createSpyObj('target1', ['addEffect', 'removeEffect']);
            target1.uuid = 'uuid-1';
            target2 = jasmine.createSpyObj('target2', ['addEffect', 'removeEffect']);
            target2.uuid = 'uuid-2';

            copy1 = jasmine.createSpyObj('copy1', ['apply', 'unapply']);
            copy2 = jasmine.createSpyObj('copy2', ['apply', 'unapply']);

            gain = Object.create(GainAbility.prototype);
            gain.abilityType = AbilityTypes.Persistent;
            const queued = [copy1, copy2];
            spyOn(gain, 'getCopy').and.callFake(() => queued.shift() as unknown as GainAbility);

            effect = new StaticEffect(EffectNames.GainAbility, gain);
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
