import { msg } from '../../GameChat.js';
import { Location, Players } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { gainPlayAction } from '../../effects.js';
import { flipDynasty } from '../../GameActions/GameActions.js';
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
            .selectCard({
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.player.areLocationsAdjacent(context.source.location, card.location),
                gameAction: flipDynasty(),
                message: (_context, card, player) => msg`${player} chooses to turn ${card} in ${card.location} faceup`
            })
            .chatText('turn a card in an adjacent province faceup');
    }
}
