import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';

class BorderlandsFortifications extends DrawCard {
    static id = 'borderlands-fortifications';

    setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Switch this card with another',
            target: {
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card: BaseCard, context?: AbilityContext) => card.isDynasty && card !== context?.source
            },
            effect: 'swap it with {1}',
            effectArgs: (context) => context.target?.isFacedown() ? 'a facedown card' : context.target ?? '',
            handler: (context) => {
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
            }
        });
    }
}


export default BorderlandsFortifications;
