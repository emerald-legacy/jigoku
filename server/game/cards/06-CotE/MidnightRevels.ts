import { CardTypes } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MidnightRevels extends ProvinceCard {
    static id = 'midnight-revels';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onConflictDeclared: (event: any, context: any) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any, context: any) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay((c: any) => c.type === CardTypes.Character);
                    return card.getCost() === Math.max(...charactersInPlay.map((c: any) => c.getCost()));
                },
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
