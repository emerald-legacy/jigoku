import { Players, TargetModes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class NightingaleTattoo extends DrawCard {
    static id = 'nightingale-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'monk'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.reaction({
            title: 'Shuffle cards into deck',
            when: {
                onCardAttached: (event, context) => (
                    context.source.parent && event.card === context.source &&
                    event.originalLocation !== Locations.PlayArea
                )
            },
            target: {
                mode: TargetModes.UpTo,
                activePromptTitle: 'Choose up to 5 conflict cards',
                numCards: 5,
                location: Locations.ConflictDiscardPile,
                cardCondition: (card) => card.hasTrait('tattoo') || card.hasTrait('kiho'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.returnToDeck({ location: Locations.ConflictDiscardPile, shuffle: true })
            }
        });
    }
}
