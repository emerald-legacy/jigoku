import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';

class Kamayari extends DrawCard {
    static id = 'kamayari';

    override setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Bushi
        });

        this.reaction('Bow character who triggered ability')
            .when({
                onCardAbilityInitiated: (event, context) => !event.resolvedWithoutTriggering && event.card.type === CardType.Character && event.ability.isTriggeredAbility() &&
                    !!context.source.parentCharacter && context.source.parentCharacter.isParticipating()
            })
            .bow((context) => ({ target: context.event.card }));
    }
}


export default Kamayari;
