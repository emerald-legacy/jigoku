import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { cancel, discardAtRandom } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type Player from '../../../Player.js';

const DOSHIN_TAX = 2;

function protectedAttachments(cardTargets: BaseCard[], player: Player): BaseCard[] {
    return cardTargets.filter((card) =>
        card.type === CardType.Attachment &&
        card.parentCharacter?.controller === player &&
        card.location === Location.PlayArea
    );
}

export default class VillageDoshin extends DrawCard {
    static id = 'village-doshin';

    public override setupCardAbilities() {
        this.wouldInterrupt('Protect attachment from leaving play')
            .when({
                onInitiateAbilityEffects: (event, context) => protectedAttachments(event.cardTargets, context.player).length > 0
            })
            .location(Location.Hand)
            .cost(costs.discardSelf())
            .if((context) => {
                const initiator = context.event.context.player;
                return initiator.hand.length >= DOSHIN_TAX && discardAtRandom({ amount: DOSHIN_TAX }).canAffect(initiator, context);
            })
                .chooseAction((context) => ({
                    player: context.event.context.player === context.player ? Players.Self : Players.Opponent,
                    activePromptTitle: 'Select one',
                    choices: {
                        [`Discard ${DOSHIN_TAX} random cards from hand`]: {
                            action: discardAtRandom({
                                amount: DOSHIN_TAX,
                                target: context.event.context.player
                            }),
                            message: (_context, _target, player) => msg`${player} distracts the Dōshin`
                        },
                        'Let the effect be canceled': {
                            action: cancel(),
                            message: (context, _target, player) => msg`${player} refuses to discard ${DOSHIN_TAX} cards. The effects of ${context.event.card} are canceled`
                        }
                    }
                }))
            .otherwise()
                .cancel()
            .chatText((context) => msg`protect ${protectedAttachments(context.event.cardTargets, context.player)}`);
    }
}
