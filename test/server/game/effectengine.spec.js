import { EffectEngine } from '../../../build/server/game/EffectEngine.js';

const makeEffect = (overrides = {}) => Object.assign({
    duration: 'untilEndOfConflict',
    isEffectActive: jasmine.createSpy('isEffectActive').and.returnValue(true),
    effect: { type: 'someEffect', getValue: () => ({}) },
    cancel: jasmine.createSpy('cancel'),
    context: { player: undefined },
    until: undefined
}, overrides);

describe('EffectEngine', function () {
    beforeEach(function () {
        this.mockGame = {
            on: jasmine.createSpy('on'),
            removeListener: jasmine.createSpy('removeListener'),
            addMessage: jasmine.createSpy('addMessage')
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

    describe('add()', function () {
        it('should append the effect to the effects list', function () {
            const effect = makeEffect();
            this.engine.add(effect);
            expect(this.engine.effects).toContain(effect);
        });

        it('should set the newEffect flag', function () {
            const effect = makeEffect();
            this.engine.newEffect = false;
            this.engine.add(effect);
            expect(this.engine.newEffect).toBe(true);
        });

        it('should return the effect that was added', function () {
            const effect = makeEffect();
            expect(this.engine.add(effect)).toBe(effect);
        });

        it('should register custom duration events when duration is Custom', function () {
            const effect = makeEffect({ duration: 'lastingEffect', until: { onSomething: () => true } });
            this.engine.add(effect);
            expect(this.mockGame.on).toHaveBeenCalledWith('onSomething', jasmine.any(Function));
        });

        it('should not register custom duration events for non-custom durations', function () {
            const effect = makeEffect({ duration: 'untilEndOfConflict' });
            this.mockGame.on.calls.reset();
            this.engine.add(effect);
            expect(this.mockGame.on).not.toHaveBeenCalled();
        });
    });

    describe('unapplyAndRemove()', function () {
        it('should remove effects matching the predicate', function () {
            const keep = makeEffect();
            const drop = makeEffect();
            this.engine.effects = [keep, drop];

            this.engine.unapplyAndRemove((effect) => effect === drop);

            expect(this.engine.effects).toEqual([keep]);
        });

        it('should cancel removed effects', function () {
            const effect = makeEffect();
            this.engine.effects = [effect];

            this.engine.unapplyAndRemove(() => true);

            expect(effect.cancel).toHaveBeenCalled();
        });

        it('should not cancel kept effects', function () {
            const keep = makeEffect();
            const drop = makeEffect();
            this.engine.effects = [keep, drop];

            this.engine.unapplyAndRemove((effect) => effect === drop);

            expect(keep.cancel).not.toHaveBeenCalled();
        });

        it('should return true when at least one effect was removed', function () {
            const effect = makeEffect();
            this.engine.effects = [effect];
            expect(this.engine.unapplyAndRemove(() => true)).toBe(true);
        });

        it('should return false when no effect matches', function () {
            const effect = makeEffect();
            this.engine.effects = [effect];
            expect(this.engine.unapplyAndRemove(() => false)).toBe(false);
        });

        it('should unregister custom duration events for removed custom-duration effects', function () {
            const effect = makeEffect({ duration: 'lastingEffect', until: { onSomething: () => true } });
            this.engine.add(effect);

            this.engine.unapplyAndRemove((e) => e === effect);

            expect(this.mockGame.removeListener).toHaveBeenCalledWith('onSomething', jasmine.any(Function));
        });
    });

    describe('onConflictFinished()', function () {
        it('should remove effects with UntilEndOfConflict duration', function () {
            const conflictEffect = makeEffect({ duration: 'untilEndOfConflict' });
            const roundEffect = makeEffect({ duration: 'untilEndOfRound' });
            this.engine.effects = [conflictEffect, roundEffect];

            this.engine.onConflictFinished();

            expect(this.engine.effects).toEqual([roundEffect]);
            expect(conflictEffect.cancel).toHaveBeenCalled();
        });
    });

    describe('onDuelFinished()', function () {
        it('should remove effects with UntilEndOfDuel duration', function () {
            const duelEffect = makeEffect({ duration: 'untilEndOfDuel' });
            const conflictEffect = makeEffect({ duration: 'untilEndOfConflict' });
            this.engine.effects = [duelEffect, conflictEffect];

            this.engine.onDuelFinished();

            expect(this.engine.effects).toEqual([conflictEffect]);
        });
    });

    describe('onPhaseEnded()', function () {
        it('should remove effects with UntilEndOfPhase duration', function () {
            const phaseEffect = makeEffect({ duration: 'untilEndOfPhase' });
            const roundEffect = makeEffect({ duration: 'untilEndOfRound' });
            this.engine.effects = [phaseEffect, roundEffect];

            this.engine.onPhaseEnded();

            expect(this.engine.effects).toEqual([roundEffect]);
        });
    });

    describe('onRoundEnded()', function () {
        it('should remove effects with UntilEndOfRound duration', function () {
            const roundEffect = makeEffect({ duration: 'untilEndOfRound' });
            const conflictEffect = makeEffect({ duration: 'untilEndOfConflict' });
            this.engine.effects = [roundEffect, conflictEffect];

            this.engine.onRoundEnded();

            expect(this.engine.effects).toEqual([conflictEffect]);
        });
    });

    describe('onPassActionPhasePriority()', function () {
        beforeEach(function () {
            this.activePlayer = { name: 'active' };
            this.otherPlayer = { name: 'other' };
        });

        it('should remove UntilSelfPassPriority effects when the owning player passes', function () {
            const effect = makeEffect({
                duration: 'untilSelfPassPriority',
                context: { player: this.activePlayer }
            });
            this.engine.effects = [effect];

            this.engine.onPassActionPhasePriority({ player: this.activePlayer });

            expect(this.engine.effects).toEqual([]);
            expect(effect.cancel).toHaveBeenCalled();
        });

        it('should not remove UntilSelfPassPriority effects when a different player passes', function () {
            const effect = makeEffect({
                duration: 'untilSelfPassPriority',
                context: { player: this.activePlayer }
            });
            this.engine.effects = [effect];

            this.engine.onPassActionPhasePriority({ player: this.otherPlayer });

            // First loop did not flip; second loop catches all UntilSelfPassPriority and reassigns to UntilPassPriority,
            // but only after the unapply step. So the effect survives this call but is now marked UntilPassPriority.
            expect(this.engine.effects).toEqual([effect]);
            expect(effect.duration).toBe('untilPassPriority');
        });

        it('should remove UntilPassPriority effects', function () {
            const effect = makeEffect({ duration: 'untilPassPriority' });
            this.engine.effects = [effect];

            this.engine.onPassActionPhasePriority({ player: this.activePlayer });

            expect(this.engine.effects).toEqual([]);
        });

        it('should convert UntilOpponentPassPriority effects to UntilPassPriority after the unapply step', function () {
            const effect = makeEffect({ duration: 'untilOpponentPassPriority' });
            this.engine.effects = [effect];

            this.engine.onPassActionPhasePriority({ player: this.activePlayer });

            // Survives this call but is now ready to be removed on the next pass.
            expect(effect.duration).toBe('untilPassPriority');
            expect(this.engine.effects).toEqual([effect]);
        });

        it('should convert UntilNextPassPriority effects to UntilOpponentPassPriority', function () {
            const effect = makeEffect({ duration: 'untilNextPassPriority' });
            this.engine.effects = [effect];

            this.engine.onPassActionPhasePriority({ player: this.activePlayer });

            expect(effect.duration).toBe('untilOpponentPassPriority');
            expect(this.engine.effects).toEqual([effect]);
        });

        it('should leave unrelated durations alone', function () {
            const effect = makeEffect({ duration: 'untilEndOfRound' });
            this.engine.effects = [effect];

            this.engine.onPassActionPhasePriority({ player: this.activePlayer });

            expect(effect.duration).toBe('untilEndOfRound');
            expect(this.engine.effects).toEqual([effect]);
        });
    });

    describe('removeLastingEffects()', function () {
        beforeEach(function () {
            this.card = { name: 'card' };
        });

        it('should remove non-persistent effects matching the card', function () {
            const effect = makeEffect({ duration: 'untilEndOfConflict', match: this.card });
            this.engine.effects = [effect];

            this.engine.removeLastingEffects(this.card);

            expect(this.engine.effects).toEqual([]);
        });

        it('should leave persistent effects alone', function () {
            const effect = makeEffect({ duration: 'persistent', match: this.card });
            this.engine.effects = [effect];

            this.engine.removeLastingEffects(this.card);

            expect(this.engine.effects).toEqual([effect]);
        });

        it('should clear canChangeZoneOnce instead of removing the effect', function () {
            const effect = makeEffect({
                duration: 'untilEndOfConflict',
                match: this.card,
                canChangeZoneOnce: true
            });
            this.engine.effects = [effect];

            this.engine.removeLastingEffects(this.card);

            expect(this.engine.effects).toEqual([effect]);
            expect(effect.canChangeZoneOnce).toBe(false);
        });

        it('should decrement canChangeZoneNTimes instead of removing the effect', function () {
            const effect = makeEffect({
                duration: 'untilEndOfConflict',
                match: this.card,
                canChangeZoneNTimes: 3
            });
            this.engine.effects = [effect];

            this.engine.removeLastingEffects(this.card);

            expect(this.engine.effects).toEqual([effect]);
            expect(effect.canChangeZoneNTimes).toBe(2);
        });

        it('should not touch effects matching a different card', function () {
            const otherCard = { name: 'other' };
            const effect = makeEffect({ duration: 'untilEndOfConflict', match: otherCard });
            this.engine.effects = [effect];

            this.engine.removeLastingEffects(this.card);

            expect(this.engine.effects).toEqual([effect]);
        });
    });

    describe('getDebugInfo()', function () {
        it('should map each effect through getDebugInfo()', function () {
            const effect = makeEffect();
            effect.getDebugInfo = jasmine.createSpy('getDebugInfo').and.returnValue({ id: 1 });
            this.engine.effects = [effect];

            expect(this.engine.getDebugInfo()).toEqual([{ id: 1 }]);
        });

        it('should return an empty list when there are no effects', function () {
            expect(this.engine.getDebugInfo()).toEqual([]);
        });
    });
});
