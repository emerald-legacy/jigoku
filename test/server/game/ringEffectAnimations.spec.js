import { WaterRingAbility } from '../../../build/server/game/Rings/WaterRingAbility.js';
import { FireRingAbility } from '../../../build/server/game/Rings/FireRingAbility.js';
import { VoidRingAbility } from '../../../build/server/game/Rings/VoidRingAbility.js';
import { EarthRingAbility } from '../../../build/server/game/Rings/EarthRingAbility.js';
import { AirRingAbility } from '../../../build/server/game/Rings/AirRingAbility.js';
import { rulesFor } from '../../../build/server/game/GameRules.js';

function makeContext(overrides = {}) {
    return Object.assign({
        game: {
            addAnimation: jasmine.createSpy('addAnimation'),
            addMessage: jasmine.createSpy('addMessage'),
            applyGameAction: jasmine.createSpy('applyGameAction'),
            actions: {
                gainHonor: jasmine.createSpy('gainHonor').and.returnValue({ resolve: jasmine.createSpy('resolve') }),
                takeHonor: jasmine.createSpy('takeHonor').and.returnValue({ resolve: jasmine.createSpy('resolve') }),
                discardAtRandom: jasmine.createSpy('discardAtRandom').and.returnValue({ resolve: jasmine.createSpy('resolve') })
            },
            promptWithHandlerMenu: jasmine.createSpy('promptWithHandlerMenu'),
            roundNumber: 1,
            currentPhase: 'conflict',
            currentConflict: { element: 'air' }
        },
        player: {
            name: 'player1',
            opponent: { name: 'player2' },
            resolveRingEffects: jasmine.createSpy('resolveRingEffects'),
            checkRestrictions: jasmine.createSpy('checkRestrictions').and.returnValue(true)
        },
        target: {
            uuid: 'card-uuid-1',
            name: 'Test Card',
            bowed: false,
            allowGameAction: jasmine.createSpy('allowGameAction').and.returnValue(true)
        },
        select: null
    }, overrides);
}

describe('Ring effect animations', function() {
    describe('WaterRingAbility', function() {
        beforeEach(function() {
            this.effect = new WaterRingAbility(true, rulesFor('stronghold'));
        });

        it('adds a ready animation when target is bowed', function() {
            const context = makeContext({ target: { uuid: 'card-uuid-1', name: 'Test Card', bowed: true, allowGameAction: () => true } });
            this.effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'water', targetUuid: 'card-uuid-1', effect: 'ready' });
        });

        it('adds a bow animation when target is ready', function() {
            const context = makeContext({ target: { uuid: 'card-uuid-2', name: 'Test Card', bowed: false, allowGameAction: () => true } });
            this.effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'water', targetUuid: 'card-uuid-2', effect: 'bow' });
        });

        it('does not add an animation when player skips', function() {
            const context = makeContext({ target: null });
            this.effect.executeHandler(context);
            expect(context.game.addAnimation).not.toHaveBeenCalled();
        });
    });

    describe('FireRingAbility', function() {
        beforeEach(function() {
            this.effect = new FireRingAbility(true);
        });

        it('adds an honor animation when honor handler is invoked', function() {
            const context = makeContext();
            context.target.allowGameAction = (action) => action === 'honor';
            this.effect.executeHandler(context);
            const call = context.game.promptWithHandlerMenu.calls.mostRecent();
            call.args[1].options[0].handler();
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'fire', targetUuid: 'card-uuid-1', effect: 'honor' });
        });

        it('adds a dishonor animation when dishonor handler is invoked', function() {
            const context = makeContext();
            context.target.allowGameAction = (action) => action === 'dishonor';
            this.effect.executeHandler(context);
            const call = context.game.promptWithHandlerMenu.calls.mostRecent();
            call.args[1].options[0].handler();
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'fire', targetUuid: 'card-uuid-1', effect: 'dishonor' });
        });

        it('does not add an animation when player skips', function() {
            const context = makeContext({ target: null });
            this.effect.executeHandler(context);
            expect(context.game.addAnimation).not.toHaveBeenCalled();
        });
    });

    describe('VoidRingAbility', function() {
        beforeEach(function() {
            this.effect = new VoidRingAbility(true);
        });

        it('adds a remove-fate animation when effect resolves', function() {
            const context = makeContext();
            this.effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'void', targetUuid: 'card-uuid-1', effect: 'remove-fate' });
        });

        it('does not add an animation when player skips', function() {
            const context = makeContext({ target: null });
            this.effect.executeHandler(context);
            expect(context.game.addAnimation).not.toHaveBeenCalled();
        });
    });

    describe('EarthRingAbility', function() {
        it('adds a draw-discard animation for DRAW_AND_FORCE_DISCARD', function() {
            const effect = new EarthRingAbility(false, rulesFor('stronghold'));
            const context = makeContext({ select: 'Draw a card and opponent discards' });
            effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'earth', playerName: 'player1', effect: 'draw-discard' });
        });

        it('adds a draw animation for DRAW (skirmish, no opponent)', function() {
            const effect = new EarthRingAbility(false, rulesFor('skirmish'));
            const context = makeContext({ select: 'Draw a card' });
            context.player.opponent = null;
            effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'earth', playerName: 'player1', effect: 'draw' });
        });

        it('adds a force-discard animation for FORCE_DISCARD', function() {
            const effect = new EarthRingAbility(false, rulesFor('skirmish'));
            const context = makeContext({ select: 'Opponent discards a card' });
            effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'earth', playerName: 'player1', effect: 'force-discard' });
        });

        it('does not add an animation when player skips', function() {
            const effect = new EarthRingAbility(true, rulesFor('stronghold'));
            const context = makeContext({ select: 'Don\'t resolve' });
            effect.executeHandler(context);
            expect(context.game.addAnimation).not.toHaveBeenCalled();
        });
    });

    describe('AirRingAbility', function() {
        it('adds a gain-honor animation for GAIN_2', function() {
            const effect = new AirRingAbility(false, rulesFor('stronghold'));
            const context = makeContext({ select: 'Gain 2 Honor' });
            context.game.roundNumber = 1;
            context.game.currentPhase = 'conflict';
            context.player.honor = 10;
            effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'air', playerName: 'player1', effect: 'gain-honor' });
        });

        it('adds a take-honor animation for TAKE_1', function() {
            const effect = new AirRingAbility(false, rulesFor('stronghold'));
            const context = makeContext({ select: 'Take 1 Honor from opponent' });
            effect.executeHandler(context);
            expect(context.game.addAnimation).toHaveBeenCalledWith({ type: 'air', playerName: 'player1', effect: 'take-honor' });
        });

        it('does not add an animation when player skips', function() {
            const effect = new AirRingAbility(true, rulesFor('stronghold'));
            const context = makeContext({ select: 'Don\'t resolve' });
            effect.executeHandler(context);
            expect(context.game.addAnimation).not.toHaveBeenCalled();
        });
    });
});
