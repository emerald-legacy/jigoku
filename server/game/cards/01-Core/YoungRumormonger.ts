import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, EventNames } from '../../Constants.js';

class YoungRumormonger extends DrawCard {
    static id = 'young-rumormonger';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: (event) => event.card.type === CardTypes.Character,
                onCardDishonored: (event) => event.card.type === CardTypes.Character
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card !== context.event.card && card.controller === context.event.card.controller,
                gameAction: AbilityDsl.actions.cancel((context) => ({
                    replacementGameAction:
                        context.event.name === EventNames.OnCardHonored
                            ? AbilityDsl.actions.honor()
                            : AbilityDsl.actions.dishonor()
                }))
            }
        });
    }
}


export default YoungRumormonger;
