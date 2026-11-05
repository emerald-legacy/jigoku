import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { copyCard } from '../../../effects.js';
import {
    cardLastingEffect,
    moveCard,
    optional,
    selectAttackedProvince,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { perConflict } from '../../../AbilityLimit.js';

export default class FloatingFortress extends DrawCard {
    static id = 'floating-fortress';

    override setupCardAbilities() {
        this.conflictAction('Become another holding')
            .condition((context) => context.player.isDefendingPlayer())
            .cost(costs.payFate(1))
            .target({
                cardType: CardType.Holding,
                controller: Players.Self,
                location: Location.DynastyDiscardPile
            }, sequential([
                cardLastingEffect((context) => ({
                    target: context.source,
                    effect: copyCard(context.target)
                })),
                optional((context) => ({
                    activePromptTitle: 'Move this holding to the attacked province?',
                    gameAction: selectAttackedProvince({
                        cardCondition: (card) => card.location !== context.source.location,
                        message: (context, province, player) => msg`${player} moves ${context.source} to ${province}`,
                        subActionProperties: (card) => ({
                            target: context.source,
                            destination: card.location
                        }),
                        gameAction: moveCard({})
                    })
                }))
            ]))
            .chatText((context) => msg`turn ${context.source} into a copy of ${context.chatTarget()}`)
            .max(perConflict(1));
    }
}
