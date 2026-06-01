import StaticEffect from '../../server/game/Effects/StaticEffect.js';
import { EffectNames } from '../../server/game/Constants.js';

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
});
