import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class TheMirrorsGaze extends DrawCard {
    static id = 'the-mirror-s-gaze';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.reaction({
            title: 'Mirror an opponent\'s event',
            when: {
                onCardAbilityTriggered: (event, context) => event.card.type === CardTypes.Event && !event.context.ability.cannotBeMirrored &&
                    event.context.player === context.player.opponent && !event.cancelled
            },
            gameAction: ability.actions.resolveAbility(context => ({
                target: context.event.card,
                ability: context.event.context.ability,
                ignoredRequirements: ['cost', 'condition', 'limit'],
                event: context.event.context.event
            }))
        });
    }
}


export default TheMirrorsGaze;
