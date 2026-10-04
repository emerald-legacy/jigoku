import { CardType, Duration, Players, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

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
            .target('target', {
                activePromptTitle: 'Choose a character to give +3 military skill',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    !context.event.cardTargets.some((eventCard) => eventCard === card)
            }, AbilityDsl.actions.selectCard((context) => ({
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
                gameAction: AbilityDsl.actions.bow()
            })), AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.modifyMilitarySkill(3)
            }))
            .effect('give +3 military skill to {1} - {2} was just a distraction!', (context) => [context.target, context.event.cardTargets])
            .max(AbilityDsl.limit.perConflict(1));
    }
}
