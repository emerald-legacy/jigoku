import { Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class BorderlandsFortifications extends DrawCard {
    static id = 'borderlands-fortifications';

    setupCardAbilities() {
        this.action('Switch this card with another')
            .target('target', {
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.isDynasty && card !== context?.source
            })
            .handler((context) => {
                if(!context.target) {
                    return;
                }
                const location = context.source.location;
                context.player.removeCardFromPile(context.source);
                context.player.removeCardFromPile(context.target);
                context.source.moveTo(context.target.location);
                context.target.moveTo(location);
                context.player.getSourceList(location).push(context.target);
                context.player.getSourceList(context.source.location).push(context.source);
            })
            .effect('swap it with {1}', (context) => context.target?.isFacedown() ? 'a facedown card' : context.target ?? '');
    }
}


export default BorderlandsFortifications;
