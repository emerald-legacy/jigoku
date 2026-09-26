import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MediatorOfHostilities extends DrawCard {
    static id = 'mediator-of-hostilities';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onConflictPass: () => true
            })
            .gameAction(AbilityDsl.actions.draw())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default MediatorOfHostilities;
