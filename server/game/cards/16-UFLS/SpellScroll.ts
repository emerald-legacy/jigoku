import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class SpellScroll extends DrawCard {
    static id = 'spell-scroll';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) =>
                !!(context.source.parentCharacter?.isParticipating() &&
                context.game.requireConflict().elements.some((element) =>
                    context.source.parentCharacter?.hasTrait(element)
                )),
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });

        this.action('Put a card into your hand')
            .condition((context) => !!context.source.parentCharacter)
            .target('target', {
                location: Location.ConflictDiscardPile,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.type !== CardType.Character &&
                    !!context.source.parentCharacter?.hasSomeTrait(card.getTraitSet())
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.moveCard((context) => ({
                    target: context.target,
                    destination: Location.Hand
                })),
                AbilityDsl.actions.sacrifice((context) => ({ target: context.source }))
            ]))
            .effect('move {1} to their hand and sacrifice {2}', (context) => [context.target ?? '', context.source]);
    }
}
