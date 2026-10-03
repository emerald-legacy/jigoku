import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class RagingBattleground extends ProvinceCard {
    static id = 'raging-battleground';

    setupCardAbilities() {
        this.reaction('Choose a character to discard')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique() && card.getFate() < 1
            }, AbilityDsl.actions.discardFromPlay());
    }
}
