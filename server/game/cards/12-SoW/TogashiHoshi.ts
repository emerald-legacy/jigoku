import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

import { CardTypes, Durations } from '../../Constants.js';

class TogashiHoshi extends DrawCard {
    static id = 'togashi-hoshi';

    setupCardAbilities() {
        this.action({
            title: 'Turn attachment into character',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent.controller === context.player,
                subActionProperties: card => ({
                    target: card,
                    effect: [AbilityDsl.effects.changeType(CardTypes.Character)].concat(
                        card.printedType === CardTypes.Attachment ? [
                            AbilityDsl.effects.setBaseMilitarySkill(parseInt(card.cardData.military_bonus)),
                            AbilityDsl.effects.setBasePoliticalSkill(parseInt(card.cardData.political_bonus)),
                            AbilityDsl.effects.setBaseGlory(0)
                        ] : []
                    )
                }),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.detach(),
                    AbilityDsl.actions.cardLastingEffect({ duration: Durations.Custom })
                ])
            })
        });
    }
}


export default TogashiHoshi;
