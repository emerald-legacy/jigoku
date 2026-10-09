import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, EventName } from '../../../Constants.js';
import { loseFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { Cost } from '../../../costs/Cost.js';
import type Player from '../../../Player.js';
import type Game from '../../../Game.js';
import { EventRegistrar } from '../../../EventRegistrar.js';

const GLOBAL_TRACKER = new WeakMap<Game, WeakMap<Player, number>>();

function refreshObjectionCost(game: Game): void {
    GLOBAL_TRACKER.set(game, new WeakMap());
}

function currentObjectionCost(player: Player): number {
    return GLOBAL_TRACKER.get(player.game)?.get(player) ?? 0;
}

function increaseObjectionCost(player: Player) {
    const gameTracker = GLOBAL_TRACKER.get(player.game);
    if(!gameTracker) {
        GLOBAL_TRACKER.set(player.game, new WeakMap([[player, 1]]));
        return;
    }
    gameTracker.set(player, currentObjectionCost(player) + 1);
}

class ObjectionCost implements Cost {
    getActionName(): string {
        return 'objectionCost';
    }

    canPay(context: AbilityContext): boolean {
        const amount = currentObjectionCost(context.player);
        return amount === 0 || loseFate({ target: context.player, amount }).hasLegalTarget(context);
    }

    pay(context: AbilityContext): void {
        const fateCost = currentObjectionCost(context.player);
        if(fateCost > 0) {
            loseFate({ target: context.player, amount: fateCost }).resolve(context.player, context);
        }

        increaseObjectionCost(context.player);
    }
}

export default class Objection extends DrawCard {
    static id = 'objection-';

    setupCardAbilities() {
        new EventRegistrar(this.game).register({
            [EventName.OnPhaseStarted]: () => this.onPhaseStarted()
        });

        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardType.Event && context.player.imperialFavor !== ''
            })
            .cost(new ObjectionCost())
            .cancel()
            .cannotBeMirrored();
    }

    onPhaseStarted() {
        refreshObjectionCost(this.game);
    }
}
