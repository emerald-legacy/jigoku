import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import { CardType, Duration } from '../../Constants.js';

class TogashiHoshi extends DrawCard {
    static id = 'togashi-hoshi';

    setupCardAbilities() {
        this.action({
            title: 'Turn attachment into character',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parent?.controller === context.player,
                subActionProperties: (card: DrawCard) => ({
                    target: card,
                    effect: [AbilityDsl.effects.changeType(CardType.Character)].concat(
                        card.printedType === CardType.Attachment ? [
                            AbilityDsl.effects.setBaseMilitarySkill(parseInt(card.cardData.military_bonus ?? '')),
                            AbilityDsl.effects.setBasePoliticalSkill(parseInt(card.cardData.political_bonus ?? '')),
                            AbilityDsl.effects.setBaseGlory(0)
                        ] : []
                    )
                }),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.detach(),
                    AbilityDsl.actions.cardLastingEffect({ duration: Duration.Custom })
                ])
            })
        });
    }
}


export default TogashiHoshi;
