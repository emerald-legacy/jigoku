import DrawCard from '../../../DrawCard.js';
import { Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class HeraldOfJade extends DrawCard {
    static id = 'herald-of-jade';

    setupCardAbilities() {
        this.reaction('Discard a status token and gain 1 honor')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .tokenTarget('target', {
                location: Location.Any
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardStatusToken(),
                AbilityDsl.actions.gainHonor(context => ({
                    target: context.player,
                    amount: 1
                }))
            ]))
            .effect('discard {1}\'s {2} and gain 1 honor', context => [
                context.token?.[0]?.card,
                context.token
            ]);
    }
}


export default HeraldOfJade;
