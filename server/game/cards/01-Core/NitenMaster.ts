import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class NitenMaster extends DrawCard {
    static id = 'niten-master';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Ready this character',
            when: {
                onCardAttached: (event, context) => (
                    event.parent === context.source &&
                    event.card.hasTrait('weapon') &&
                    event.card.controller === context.player
                )
            },
            gameAction: ability.actions.ready(),
            limit: ability.limit.perRound(2)
        });
    }
}


export default NitenMaster;
