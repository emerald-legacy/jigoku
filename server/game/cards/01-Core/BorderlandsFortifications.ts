import DrawCard from '../../drawcard.js';
import { Locations, Players } from '../../Constants.js';

class BorderlandsFortifications extends DrawCard {
    static id = 'borderlands-fortifications';

    setupCardAbilities() {
        this.action({
            title: 'Switch this card with another',
            target: {
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.isDynasty && card !== context.source
            },
            effect: 'swap it with {1}',
            effectArgs: context => context.target.isFacedown() ? 'a facedown card' : context.target,
            handler: context => {
                let location = context.source.location;
                context.player.removeCardFromPile(context.source);
                context.player.removeCardFromPile(context.target);
                context.source.moveTo(context.target.location);
                context.target.moveTo(location);
                context.player.getSourceList(location).push(context.target);
                context.player.getSourceList(context.source.location).push(context.source);
            }
        });
    }
}


export default BorderlandsFortifications;
