import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MidnightRevels extends ProvinceCard {
    static id = 'midnight-revels';

    setupCardAbilities() {
        this.reaction('Bow a character')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const charactersInPlay = context.game.findAnyCardsInPlay((c) => c.type === CardType.Character);
                    return card.getCost() === Math.max(...charactersInPlay.map((c) => c.getCost() ?? 0));
                }
            }, AbilityDsl.actions.bow());
    }
}
