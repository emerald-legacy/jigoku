import { Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { moveCard } from '../../GameActions/GameActions.js';

class BorderlandsFortifications extends DrawCard {
    static id = 'borderlands-fortifications';

    setupCardAbilities() {
        this.action('Switch this card with another')
            .target({
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.isDynasty && card !== context.source
            }, moveCard((context) => ({
                target: context.source,
                destination: context.target.location,
                switch: true,
                switchTarget: context.target.isDrawCard() ? context.target : undefined
            })))
            .chatText('swap it with {1}', (context) => context.target.isFacedown() ? 'a facedown card' : context.target);
    }
}


export default BorderlandsFortifications;
