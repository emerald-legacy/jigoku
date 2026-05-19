import { EffectEngine } from '../../../build/server/game/EffectEngine.js';

describe('EffectEngine', function () {
    beforeEach(function () {
        this.mockGame = {
            on: jasmine.createSpy('on'),
            removeListener: jasmine.createSpy('removeListener')
        };
        this.engine = new EffectEngine(this.mockGame);
    });

    describe('checkEffects', function () {
        it('should return false when no state changed and no new effect', function () {
            const result = this.engine.checkEffects(false);
            expect(result).toBe(false);
        });

        it('should check effects when prevStateChanged is true', function () {
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.returnValue(false)
            };
            this.engine.effects = [mockEffect];

            this.engine.checkEffects(true);

            expect(mockEffect.checkCondition).toHaveBeenCalled();
        });

        it('should check effects when newEffect is true', function () {
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.returnValue(false)
            };
            this.engine.effects = [mockEffect];
            this.engine.newEffect = true;

            this.engine.checkEffects(false);

            expect(mockEffect.checkCondition).toHaveBeenCalled();
        });

        it('should not recurse when no effect reports state changed', function () {
            let callCount = 0;
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.callFake(function () {
                    callCount++;
                    return false;
                })
            };
            this.engine.effects = [mockEffect];

            this.engine.checkEffects(true);

            // Should be called once in the first pass, then stop
            // because stateChanged is false and newEffect is false
            expect(callCount).toBe(1);
        });

        it('should recurse when an effect reports state changed', function () {
            let callCount = 0;
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.callFake(function () {
                    callCount++;
                    // First call: state changed. Second call: no change.
                    return callCount === 1;
                })
            };
            this.engine.effects = [mockEffect];

            this.engine.checkEffects(true);

            // Called twice: first pass changes state, second pass confirms stability
            expect(callCount).toBe(2);
        });

        it('should throw after 10 loops to prevent infinite recursion', function () {
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.returnValue(true)
            };
            this.engine.effects = [mockEffect];

            expect(() => this.engine.checkEffects(true)).toThrowError(
                'EffectEngine.checkEffects looped 10 times'
            );
        });

        it('should reset newEffect flag before checking', function () {
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.returnValue(false)
            };
            this.engine.effects = [mockEffect];
            this.engine.newEffect = true;

            this.engine.checkEffects(false);

            expect(this.engine.newEffect).toBe(false);
        });

        it('should recurse when newEffect is set during checkCondition', function () {
            let callCount = 0;
            const engine = this.engine;
            const mockEffect = {
                checkCondition: jasmine.createSpy('checkCondition').and.callFake(function () {
                    callCount++;
                    if(callCount === 1) {
                        // Simulate a new effect being added during condition check
                        engine.newEffect = true;
                    }
                    return false;
                })
            };
            this.engine.effects = [mockEffect];

            this.engine.checkEffects(true);

            // First pass: stateChanged=false but newEffect=true, so recurse
            // Second pass: stateChanged=false and newEffect=false, so stop
            expect(callCount).toBe(2);
        });
    });
});
