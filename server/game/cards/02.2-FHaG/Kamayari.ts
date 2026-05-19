import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class Kamayari extends DrawCard {
    static id = 'kamayari';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.card.type === CardTypes.Character && context.source.parent && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.bow(context => ({ target: context.event.card }))
        });
    }
}


export default Kamayari;
