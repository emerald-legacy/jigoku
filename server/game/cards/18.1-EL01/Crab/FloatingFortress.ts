import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { copyCard } from '../../../effects.js';
import {
    cardLastingEffect,
    chooseAction,
    moveCard,
    noAction,
    selectAttackedProvince,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { perConflict } from '../../../AbilityLimit.js';

export default class FloatingFortress extends DrawCard {
    static id = 'floating-fortress';

    override setupCardAbilities() {
        this.action('Become another holding')
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
                chooseAction({
                    activePromptTitle: 'Move the holding to into the attacked provinces?',
                    choices: {
                        Yes: selectAttackedProvince((context) => ({
                            message: (context, province, player) => msg`${player} moves ${context.source} to ${province}`,
                            subActionProperties: (card) => ({
                                target: context.source,
                                destination: card.location
                            }),
                            gameAction: moveCard({})
                        })),
                        No: noAction()
                    }
                })
            ]))
            .chatText((context) => msg`turn ${context.source} into a copy of ${context.chatTarget()}`)
            .max(perConflict(1));
    }
}
