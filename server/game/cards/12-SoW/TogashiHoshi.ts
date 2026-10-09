import DrawCard from '../../DrawCard.js';
import { changeType, setBaseGlory, setBaseMilitarySkill, setBasePoliticalSkill } from '../../effects.js';
import { cardLastingEffect, detach, multiple } from '../../GameActions/GameActions.js';

import { CardType, Duration } from '../../Constants.js';

class TogashiHoshi extends DrawCard {
    static id = 'togashi-hoshi';

    setupCardAbilities() {
        this.action('Turn attachment into character')
            .selectCard({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parentCharacter?.controller === context.player,
                subActionProperties: (card) => ({
                    target: card,
                    effect: [changeType(CardType.Character)].concat(
                        card.printedType === CardType.Attachment ? [
                            setBaseMilitarySkill(parseInt(card.cardData.military_bonus ?? '')),
                            setBasePoliticalSkill(parseInt(card.cardData.political_bonus ?? '')),
                            setBaseGlory(0)
                        ] : []
                    )
                }),
                gameAction: multiple([
                    detach(),
                    cardLastingEffect({ duration: Duration.Custom })
                ])
            });
    }
}


export default TogashiHoshi;
