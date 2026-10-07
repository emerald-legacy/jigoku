import { CardType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { cardCannot } from '../../effects.js';
import {
    cardLastingEffect,
    conditional,
    multiple,
    noAction,
    placeFate,
    selectRing
} from '../../GameActions/GameActions.js';

export default class HighHouseOfLight extends StrongholdCard {
    static id = 'high-house-of-light';

    setupCardAbilities() {
        this.action('Prevent a monk from being targeted by opponent\'s events')
            .cost(costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsEvents',
                        applyingPlayer: context.player
                    })
                })),
                conditional({
                    condition: (context) => (this.game.currentConflict?.getNumberOfCardsPlayed(context.player) ?? 0) >= 5,
                    trueGameAction: selectRing((context) => ({
                        activePromptTitle: 'Choose a ring to take a fate from',
                        message: '{0} moves a fate from the {1} to {2}',
                        ringCondition: (ring) => ring.fate >= 1,
                        messageArgs: (ring) => [context.player, ring, context.target],
                        subActionProperties: (ring) => ({ origin: ring }),
                        gameAction: placeFate({ target: context.target })
                    })),
                    falseGameAction: noAction()
                })
            ]))
            .effect('make {0} unable to be targeted by opponent\'s events');
    }
}
