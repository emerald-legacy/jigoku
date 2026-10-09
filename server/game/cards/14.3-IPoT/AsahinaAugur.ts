import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { canBeSeenWhenFacedown } from '../../effects.js';
import { discardCard } from '../../GameActions/GameActions.js';
import { Location, Players, CardType } from '../../Constants.js';

class AsahinaAugur extends DrawCard {
    static id = 'asahina-augur';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card) => card.isDynasty && card.isFacedown(),
            effect: canBeSeenWhenFacedown()
        });

        this.action('Discard a card in a province')
            .target({
                cardType: [CardType.Character, CardType.Holding, CardType.Event],
                location: Location.Provinces,
                controller: Players.Self
            }, discardCard())
            .chatText((context) => msg`discard ${context.target.isFacedown() ? 'a facedown card' : context.target} in ${context.target.location}`)
            .limit(perRound(3));
    }
}


export default AsahinaAugur;
