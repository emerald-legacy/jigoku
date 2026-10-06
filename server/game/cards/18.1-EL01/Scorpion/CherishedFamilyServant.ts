import { addKeyword, entersPlayForOpponent } from '../../../effects.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CherishedFamilyServant extends DrawCard {
    static id = 'cherished-family-servant';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: entersPlayForOpponent()
        });

        this.persistentEffect({
            match: (card, context) =>
                !!(card.getType() === CardType.Attachment &&
                card.hasTrait('poison') &&
                card.parentCharacter &&
                context?.source.controller === card.parentCharacter.controller),
            effect: addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}
