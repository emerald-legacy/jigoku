import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CherishedFamilyServant extends DrawCard {
    static id = 'cherished-family-servant';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: AbilityDsl.effects.entersPlayForOpponent()
        });

        this.persistentEffect({
            match: (card: DrawCard, context) =>
                !!(card.getType() === CardType.Attachment &&
                card.hasTrait('poison') &&
                card.parent &&
                context?.source.controller === card.parent.controller),
            effect: AbilityDsl.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}
