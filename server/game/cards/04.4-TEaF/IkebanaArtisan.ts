import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IkebanaArtisan extends DrawCard {
    static id = 'ikebana-artisan';

    setupCardAbilities() {
        this.wouldInterrupt('Lose fate instead of honor')
            .when({
                onModifyHonor: (event, context) => event.dueToUnopposed && event.player === context.player
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.loseFate(context => ({ target: context.player }))
            ]))
            .effect('lose 1 fate rather than 1 honor for not defending the conflict')
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default IkebanaArtisan;
