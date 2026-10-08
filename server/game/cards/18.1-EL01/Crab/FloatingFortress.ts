import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { copyCard } from '../../../effects.js';
import {
    cardLastingEffect,
    chooseAction,
    moveCard,
    noAction,
    selectCard,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class FloatingFortress extends DrawCard {
    static id = 'floating-fortress';

    setupCardAbilities() {
        this.action('Become another holding')
            .cost(costs.payFate(1))
            .condition((context) => context.player.isDefendingPlayer())
            .target({
                cardType: CardType.Holding,
                controller: Players.Self,
                location: Location.DynastyDiscardPile
            }, sequential([
                cardLastingEffect((context) => ({
                    target: context.source,
                    effect: copyCard(context.target)
                })),
                chooseAction({
                    activePromptTitle: 'Move the holding to into the attacked provinces?',
                    options: {
                        Yes: {
                            action: selectCard((context) => ({
                                activePromptTitle: 'Choose an attacked province',
                                hidePromptIfSingleCard: true,
                                cardType: CardType.Province,
                                location: Location.Provinces,
                                message: (context, province, player) => msg`${player} moves ${context.source} to ${province}`,
                                cardCondition: (card) => card.isConflictProvince(),
                                subActionProperties: (card) => ({
                                    target: context.source,
                                    destination: card.location
                                }),
                                gameAction: moveCard({})
                            }))
                        },
                        No: { action: noAction() }
                    }
                })
            ]))
            .chatText((context) => msg`turn ${context.source} into a copy of ${context.chatTarget()}`);
    }
}
