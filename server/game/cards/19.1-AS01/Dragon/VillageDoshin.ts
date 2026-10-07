import * as costs from '../../../costs/index.js';
import { cancel, chooseAction, discardAtRandom } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const DOSHIN_TAX = 2;

export default class VillageDoshin extends DrawCard {
    static id = 'village-doshin';

    public setupCardAbilities() {
        this.wouldInterrupt('Protect attachment from leaving play')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.cardTargets.some((card) => {
                        const attachment = card.type === CardType.Attachment;
                        const onCharacterYouControl =
                            card.parentCharacter?.controller === context.player;
                        const inPlay = card.location === Location.PlayArea;
                        return attachment && onCharacterYouControl && inPlay;
                    })
            })
            .cost(costs.discardSelf())
            .effect('protect {1}', (context) => context.event.cardTargets)
            .location(Location.Hand)
            .if((context) => {
                const opponentHasEnoughCards = (context.player.opponent?.hand.length ?? 0) >= DOSHIN_TAX;
                const opponentIsAllowedToDiscardCards = !!context.player.opponent && discardAtRandom({ amount: 2 })
                    .canAffect(context.player.opponent, context);
                return opponentHasEnoughCards && opponentIsAllowedToDiscardCards;
            })
                .gameAction(chooseAction((context) => ({
                    player: Players.Opponent,
                    activePromptTitle: 'Select one',
                    options: {
                        [`Discard ${DOSHIN_TAX} random cards from hand`]: {
                            action: discardAtRandom({
                                amount: DOSHIN_TAX,
                                target: context.player.opponent
                            }),
                            message: '{0} distracts the Dōshin'
                        },
                        'Let the effect be canceled': {
                            action: cancel(),
                            message: `{0} refuses to discard ${DOSHIN_TAX} cards. The effects of {2} are canceled`
                        }
                    },
                    messageArgs: [context.event.card]
                })))
            .otherwise()
                .cancel();
    }
}
