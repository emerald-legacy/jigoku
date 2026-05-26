import DrawCard from '../../drawcard.js';
import BaseCard from '../../basecard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Locations } from '../../Constants.js';

class KitsukiYaruma extends DrawCard {
    static id = 'kitsuki-yaruma';

    setupCardAbilities() {
        this.reaction({
            title: 'Flip province facedown',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
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
