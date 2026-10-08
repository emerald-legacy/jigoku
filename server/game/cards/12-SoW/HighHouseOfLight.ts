import { msg } from '../../GameChat.js';
import { CardType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { cardCannot } from '../../effects.js';
import {
    cardLastingEffect,
    conditional,
    multiple,
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
                        message: (context, ring) => msg`${context.player} moves a fate from the ${ring} to ${context.target}`,
                        ringCondition: (ring) => ring.fate >= 1,
                        subActionProperties: (ring) => ({ origin: ring }),
                        gameAction: placeFate({ target: context.target })
                    }))
                })
            ]))
            .chatText('make {0} unable to be targeted by opponent\'s events');
    }
}
