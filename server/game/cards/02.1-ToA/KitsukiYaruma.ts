import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { turnFacedown } from '../../GameActions/GameActions.js';
import { CardType, Location, Trait } from '../../Constants.js';

class KitsukiYaruma extends DrawCard {
    static id = 'kitsuki-yaruma';

    override setupCardAbilities() {
        this.reaction('Flip province facedown')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => !card.isBroken
            }, turnFacedown());
    }

    override allowAttachment(attachment: BaseCard): boolean {
        if(attachment.hasTrait(Trait.Poison) && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}


export default KitsukiYaruma;
