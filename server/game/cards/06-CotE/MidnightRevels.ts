import { CardTypes } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MidnightRevels extends ProvinceCard {
    static id = 'midnight-revels';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay((c) => c.type === CardTypes.Character);
                    return card.getCost() === Math.max(...charactersInPlay.map((c) => c.getCost()));
                },
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
