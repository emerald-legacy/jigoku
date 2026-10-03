import { CardType, Location, PlayType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ChainOfCommand extends DrawCard {
    static id = 'chain-of-command';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action('Ready a character')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique()
            }))
            .target('target', {
                activePromptTitle: 'Choose a unique character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique()
            }, AbilityDsl.actions.ready());
    }
}
