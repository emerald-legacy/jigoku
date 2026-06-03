import DrawCard from '../../DrawCard.js';
import BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class KitsukiYaruma extends DrawCard {
    static id = 'kitsuki-yaruma';

    setupCardAbilities() {
        this.reaction({
            title: 'Flip province facedown',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: any) => !card.isBroken,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }

    allowAttachment(attachment: BaseCard | DrawCard): boolean {
        if(attachment.hasTrait('poison') && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}


export default KitsukiYaruma;
