import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Kamayari extends DrawCard {
    static id = 'kamayari';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.reaction('Bow character who triggered ability')
            .when({
                onCardAbilityInitiated: (event, context) => event.card.type === CardType.Character && context.source.parentCharacter && context.source.parentCharacter.isParticipating()
            })
            .gameAction(ability.actions.bow((context) => ({ target: context.event.card })));
    }
}


export default Kamayari;
