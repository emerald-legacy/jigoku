import AbilityDsl from '../../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import { CardTypes, EventNames, Locations, Players } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
const DOSHIN_TAX = 2;

export default class VillageDoshin extends DrawCard {
    static id = 'village-doshin';

    public setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Protect attachment from leaving play',
            location: Locations.Hand,
            cost: AbilityDsl.costs.discardSelf(),
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventNames.OnInitiateAbilityEffects>, context) =>
                    (event.cardTargets ?? []).some((card: BaseCard) => {
                        const attachment = card.type === CardTypes.Attachment;
                        const onCharacterYouControl =
                            card instanceof DrawCard &&
                            card.parent &&
                            card.parent.type === CardTypes.Character &&
                            card.parent.controller === context.player;
                        const inPlay = card.location === Locations.PlayArea;
                        return attachment && onCharacterYouControl && inPlay;
                    })
            },

            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => {
                    const opponentHasEnoughCards = (context.player.opponent?.hand.length ?? 0) >= DOSHIN_TAX;
                    const opponentIsAllowedToDiscardCards = !!context.player.opponent && AbilityDsl.actions
                        .discardAtRandom({ amount: 2 })
                        .canAffect(context.player.opponent, context);
                    return opponentHasEnoughCards && opponentIsAllowedToDiscardCards;
                },
                falseGameAction: AbilityDsl.actions.cancel(),
                trueGameAction: AbilityDsl.actions.chooseAction((context) => ({
                    player: Players.Opponent,
                    activePromptTitle: 'Select one',
                    options: {
                        [`Discard ${DOSHIN_TAX} random cards from hand`]: {
                            action: AbilityDsl.actions.discardAtRandom({
                                amount: DOSHIN_TAX,
                                target: context.player.opponent
                            }),
                            message: '{0} distracts the Dōshin.'
                        },
                        'Let the effect be canceled': {
                            action: AbilityDsl.actions.cancel(),
                            message: `{0} refuses to discard ${DOSHIN_TAX} cards. The effects of {2} are canceled.`
                        }
                    },
                    messageArgs: [(context as TriggeredAbilityContext).event.card]
                }))
            }),
            effect: 'protect {1}',
            effectArgs: (context) => context.event.cardTargets
        });
    }
}
