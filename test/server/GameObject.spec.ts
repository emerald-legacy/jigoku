import { GameObject } from '../../server/game/GameObject.js';
import { AbilityContext } from '../../server/game/AbilityContext.js';
import type Game from '../../server/game/Game.js';
import { getGameAction, setGameActionCatalog } from '../../server/game/GameActions/GameActionRegistry.js';
import { createTestGame } from '../helpers/fixtures.js';

describe('GameObject', function() {
    let game: Game;
    let frameworkContext: AbilityContext;
    let gameObject: GameObject;

    beforeEach(function() {
        game = createTestGame();
        frameworkContext = new AbilityContext({ game });
        spyOn(game, 'getFrameworkContext').and.returnValue(frameworkContext);
        gameObject = new GameObject(game, 'test object');
    });

    describe('allowGameAction()', function() {
        describe('when the action type is registered', function() {
            let gameAction: jasmine.SpyObj<{ canAffect: (...args: unknown[]) => boolean }>;
            let factory: jasmine.Spy;

            beforeEach(function() {
                gameAction = jasmine.createSpyObj('gameAction', ['canAffect']);
                gameAction.canAffect.and.returnValue(true);
                factory = jasmine.createSpy('factory').and.returnValue(gameAction);
                setGameActionCatalog({ specAllowAction: factory });
            });

            it('should ask the produced game action whether it can affect this object', function() {
                gameObject.allowGameAction('specAllowAction');
                expect(gameAction.canAffect).toHaveBeenCalledWith(gameObject, frameworkContext);
            });

            it('should return the game action canAffect result', function() {
                gameAction.canAffect.and.returnValue(false);
                expect(gameObject.allowGameAction('specAllowAction')).toBe(false);
            });

            it('should use a supplied context over the framework context', function() {
                const otherContext = new AbilityContext({ game });
                gameObject.allowGameAction('specAllowAction', otherContext);
                expect(gameAction.canAffect).toHaveBeenCalledWith(gameObject, otherContext);
            });
        });

        describe('when the action type is not registered', function() {
            beforeEach(function() {
                spyOn(gameObject, 'checkRestrictions').and.returnValue(true);
            });

            it('should fall back to checkRestrictions', function() {
                expect(getGameAction('specUnregisteredAction')).toBeUndefined();
                gameObject.allowGameAction('specUnregisteredAction');
                expect(gameObject.checkRestrictions).toHaveBeenCalledWith('specUnregisteredAction', frameworkContext);
            });
        });
    });
});
