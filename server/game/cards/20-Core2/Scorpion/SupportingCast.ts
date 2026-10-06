import { CardType, Players, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { bow, cardLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class SupportingCast extends DrawCard {
    static id = 'supporting-cast';

    setupCardAbilities() {
        this.reaction('Give +3 military to a character')
            .when({
                onInitiateAbilityEffects: (event, context) => {
                    return (
                        context.game.isDuringConflict(ConflictType.Military) &&
                        event.cardTargets.some((card) => card.controller === context.player)
                    );
                }
            })
            .target({
                activePromptTitle: 'Choose a character to give +3 military skill',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    !context.event.cardTargets.some((eventCard) => eventCard === card)
            }, selectCard((context) => ({
                activePromptTitle: 'Choose a character to bow',
                hidePromptIfSingleCard: true,
                cardCondition: (card) =>
                    context.event.cardTargets.some((eventCard) => eventCard === card),
                subActionProperties: (card) => {
                    if(card.isDrawCard()) {
                        context.target = card;
                    }
                    return { target: card };
                },
                gameAction: bow()
            })), cardLastingEffect({
                effect: modifyMilitarySkill(3)
            }))
            .effect((context) => msg`give +3 military skill to ${context.target} - ${context.event.cardTargets} was just a distraction`)
            .max(AbilityDsl.limit.perConflict(1));
    }
}
