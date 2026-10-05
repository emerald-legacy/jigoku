import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class KitsukiYaruma extends DrawCard {
    static id = 'kitsuki-yaruma';

    setupCardAbilities() {
        this.reaction('Flip province facedown')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => !card.isBroken
            }, AbilityDsl.actions.turnFacedown());
    }

    allowAttachment(attachment: BaseCard): boolean {
        if(attachment.hasTrait('poison') && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}


export default KitsukiYaruma;
