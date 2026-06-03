import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class RagingBattleground extends ProvinceCard {
    static id = 'raging-battleground';

    setupCardAbilities() {
        this.reaction({
            title: 'Choose a character to discard',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique() && card.getFate() < 1,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
