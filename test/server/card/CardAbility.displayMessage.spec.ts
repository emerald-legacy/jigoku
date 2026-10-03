import CardAbility from '../../../server/game/CardAbility.js';
import AbilityDsl from '../../../server/game/abilitydsl.js';
import { AbilityContext } from '../../../server/game/AbilityContext.js';
import { TriggeredAbilityContext } from '../../../server/game/TriggeredAbilityContext.js';
import DrawCard from '../../../server/game/DrawCard.js';
import { StrongholdCard } from '../../../server/game/StrongholdCard.js';
import { Event } from '../../../server/game/Events/Event.js';
import TriggeredAbility from '../../../server/game/TriggeredAbility.js';
import { AbilityType, CardType, EventName } from '../../../server/game/Constants.js';
import type Game from '../../../server/game/Game.js';
import type Player from '../../../server/game/Player.js';
import { createTestCharacter, createTestGame, testPlayer } from '../../helpers/fixtures.js';

/** The fragments of a formatted chat message: `{ message: [...] }`. */
function fragmentsOf(arg: unknown): unknown[] {
    if(!(arg instanceof Object) || !('message' in arg) || !Array.isArray(arg.message)) {
        throw new Error('not a formatted message');
    }
    return arg.message;
}

function firstOf(arg: unknown): unknown {
    if(!Array.isArray(arg)) {
        throw new Error('not a list');
    }
    return arg[0];
}

describe('CardAbility displayMessage', function () {
    let game: Game;
    let player: Player;
    let addMessage: jasmine.Spy<Game['addMessage']>;
    let args: unknown[];

    beforeEach(function () {
        game = createTestGame();
        player = testPlayer(game);
        addMessage = spyOn(game, 'addMessage');
    });

    describe('Assassinaton', function () {
        let source: DrawCard;
        let target: DrawCard;

        beforeEach(function () {
            source = new DrawCard(player, { id: 'assassination', name: 'Assassination', type: CardType.Event });
            target = createTestCharacter(game, 'Target');
            const discard = AbilityDsl.actions.discardFromPlay();
            spyOn(discard, 'canAffect').and.returnValue(true);
            const ability = new CardAbility(source, {
                cost: AbilityDsl.costs.payHonor(3),
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card: DrawCard) => (card.getCost() ?? 0) <= 2,
                    gameAction: discard
                }
            });
            const context = new AbilityContext({
                game,
                player,
                source,
                costs: { loseHonor: player },
                targets: { target }
            });
            context.target = target;
            ability.displayMessage(context);
            args = addMessage.calls.allArgs()[0];
        });

        it('should send an 8 part message', function () {
            expect(args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}{7}{8}');
        });

        it('should have the player object as the first arg', function () {
            expect(args[1]).toBe(player);
        });

        it('should have \'plays\' as the second arg', function () {
            expect(args[2]).toBe(' plays ');
        });

        it('should have the source as the third arg', function () {
            expect(args[3]).toBe(source);
        });

        it('should have a comma as the sixth arg', function () {
            expect(args[6]).toBe(', ');
        });

        it('should have a cost term as the seventh arg', function () {
            const cost = fragmentsOf(firstOf(args[7]));
            expect(cost[0]).toBe('losing');
            expect(cost[1]).toBe(' ');
            expect(cost[2]).toBe(3);
            expect(cost[3]).toBe(' ');
            expect(cost[4]).toBe('honor');
        });

        it('should have \'to\' as the eighth arg', function () {
            expect(args[8]).toBe(' to ');
        });

        it('should have an effect term as the ninth arg', function () {
            const effect = fragmentsOf(args[9]);
            expect(effect[0]).toBe('discard');
            expect(effect[1]).toBe(' ');
            expect(effect[2]).toEqual(target.getShortSummary());
        });
    });

    describe('Forged Edict', function () {
        let source: DrawCard;
        let courtier: DrawCard;
        let eventToCancel: DrawCard;

        beforeEach(function () {
            source = new DrawCard(player, { id: 'forged-edict', name: 'Forged Edict', type: CardType.Event });
            courtier = createTestCharacter(game, 'Courtier');
            eventToCancel = new DrawCard(testPlayer(game, 'player2'), { id: 'event-to-cancel', name: 'Event To Cancel', type: CardType.Event });
            const ability = new TriggeredAbility(source, AbilityType.WouldInterrupt, {
                when: { onCardAbilityInitiated: () => true },
                cost: AbilityDsl.costs.dishonor({ cardCondition: (card) => card.hasTrait('courtier') }),
                effect: 'cancel {1}',
                effectArgs: (context) => context.event.card
            });
            const context = new TriggeredAbilityContext({
                game,
                player,
                source,
                ability,
                costs: { dishonor: courtier },
                event: new Event(EventName.OnCardAbilityInitiated, { card: eventToCancel })
            });
            ability.displayMessage(context);
            args = addMessage.calls.allArgs()[0];
        });

        it('should send an 8 part message', function () {
            expect(args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}{7}{8}');
        });

        it('should have the player object as the first arg', function () {
            expect(args[1]).toBe(player);
        });

        it('should have \'plays\' as the second arg', function () {
            expect(args[2]).toBe(' plays ');
        });

        it('should have the source as the third arg', function () {
            expect(args[3]).toBe(source);
        });

        it('should have a comma as the sixth arg', function () {
            expect(args[6]).toBe(', ');
        });

        it('should have a cost term as the seventh arg', function () {
            const cost = fragmentsOf(firstOf(args[7]));
            expect(cost[0]).toBe('dishonoring');
            expect(cost[1]).toBe(' ');
            expect(cost[2]).toEqual(courtier.getShortSummary());
        });

        it('should have \'to\' as the eighth arg', function () {
            expect(args[8]).toBe(' to ');
        });

        it('should have an effect term as the ninth arg', function () {
            const effect = fragmentsOf(args[9]);
            expect(effect[0]).toBe('cancel');
            expect(effect[1]).toBe(' ');
            expect(effect[2]).toEqual(eventToCancel.getShortSummary());
        });
    });

    describe('City of the Open Hand', function () {
        let source: StrongholdCard;
        let opponent: Player;

        beforeEach(function () {
            opponent = testPlayer(game, 'player2');
            opponent.honor = 10;
            // set when the game starts, which this one doesn't
            player.opponent = opponent;
            opponent.opponent = player;
            source = new StrongholdCard(player, { id: 'city-of-the-open-hand', name: 'City of the Open Hand', type: CardType.Stronghold });
            const ability = new CardAbility(source, {
                cost: AbilityDsl.costs.bowSelf(),
                gameAction: AbilityDsl.actions.takeHonor()
            });
            const context = new AbilityContext({
                game,
                player,
                source,
                costs: { bow: source }
            });
            ability.displayMessage(context);
            args = addMessage.calls.allArgs()[0];
        });

        it('should send an 8 part message', function () {
            expect(args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}{7}{8}');
        });

        it('should have the player object as the first arg', function () {
            expect(args[1]).toBe(player);
        });

        it('should have \'uses\' as the second arg', function () {
            expect(args[2]).toBe(' uses ');
        });

        it('should have the source as the third arg', function () {
            expect(args[3]).toBe(source);
        });

        it('should have a comma as the sixth arg', function () {
            expect(args[6]).toBe(', ');
        });

        it('should have a cost term as the seventh arg', function () {
            const cost = fragmentsOf(firstOf(args[7]));
            expect(cost[0]).toBe('bowing');
            expect(cost[1]).toBe(' ');
            expect(cost[2]).toEqual(source.getShortSummary());
        });

        it('should have \'to\' as the eighth arg', function () {
            expect(args[8]).toBe(' to ');
        });

        it('should have an effect term as the ninth arg', function () {
            const effect = fragmentsOf(args[9]);
            expect(effect[0]).toBe('take');
            expect(effect[1]).toBe(' ');
            expect(effect[2]).toBe(1);
            expect(effect[3]).toBe(' ');
            expect(effect[4]).toBe('honor');
            expect(effect[5]).toBe(' ');
            expect(effect[6]).toBe('from');
            expect(effect[7]).toBe(' ');
            expect(effect[8]).toEqual(opponent.getShortSummary());
        });
    });
});
