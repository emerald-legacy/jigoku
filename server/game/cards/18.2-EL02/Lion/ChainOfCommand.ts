import { CardType, Location, PlayType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { canPlayFromOwn } from '../../../effects.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ChainOfCommand extends DrawCard {
    static id = 'chain-of-command';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.ConflictDiscardPile,
            effect: canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action('Ready a character')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique()
            }))
            .target({
                activePromptTitle: 'Choose a unique character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique()
            }, ready());
    }
}
