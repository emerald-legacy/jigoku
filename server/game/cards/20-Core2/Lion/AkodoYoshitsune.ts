import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AkodoYoshitsune extends DrawCard {
    static id = 'akodo-yoshitsune';

    setupCardAbilities() {
        this.reaction('Gain an honor')
            .when({
                afterConflict: (event, context) => event.conflict?.winner === context.player
            })
            .gameAction(AbilityDsl.actions.gainHonor((context) => ({ target: context.player })))
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}
