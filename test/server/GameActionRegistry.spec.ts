import { getGameAction, setGameActionCatalog } from '../../server/game/GameActions/GameActionRegistry.js';

describe('GameActionRegistry', function() {
    describe('getGameAction()', function() {
        describe('when the name is registered', function() {
            it('should return the registered factory', function() {
                const factory = jasmine.createSpy('factory');
                setGameActionCatalog({ specRegistered: factory });
                expect(getGameAction('specRegistered')).toBe(factory);
            });
        });

        describe('when the name is not registered', function() {
            it('should return undefined', function() {
                expect(getGameAction('specMissingAction')).toBeUndefined();
            });
        });

        describe('when a non-function value is supplied', function() {
            it('should not register it', function() {
                setGameActionCatalog({ specNotAFunction: 5 });
                expect(getGameAction('specNotAFunction')).toBeUndefined();
            });
        });
    });
});
