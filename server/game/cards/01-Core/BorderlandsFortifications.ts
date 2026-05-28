import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import { Locations, Players } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

class BorderlandsFortifications extends DrawCard {
    static id = 'borderlands-fortifications';

    setupCardAbilities() {
        this.action({
            title: 'Switch this card with another',
            target: {
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card: BaseCard, context: AbilityContext) => card.isDynasty && card !== context.source
            },
            effect: 'swap it with {1}',
            effectArgs: (context: AbilityContext) => (context.target as DrawCard).isFacedown() ? 'a facedown card' : (context.target as DrawCard),
            handler: (context: any) => {
                const location = context.source.location;
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
