import { Location, Players } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { gainPlayAction } from '../../effects.js';
import { flipDynasty, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class HiddenMoonDojo extends DrawCard {
    static id = 'hidden-moon-dojo';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card, context) =>
                !!context &&
                card.isDynasty &&
                card.isFaceup() &&
                context.player.areLocationsAdjacent(context.source.location, card.location),
            effect: gainPlayAction(PlayCharacterAsIfFromHand)
        });

        this.conflictAction('Turn an adjacent card face up')
            .gameAction(selectCard({
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.player.areLocationsAdjacent(context.source.location, card.location),
                gameAction: flipDynasty(),
                message: '{0} chooses to turn {1} in {2} faceup',
                messageArgs: (card, player) => [player, card, card.location]
            }))
            .effect('turn a card in an adjacent province faceup');
    }
}
