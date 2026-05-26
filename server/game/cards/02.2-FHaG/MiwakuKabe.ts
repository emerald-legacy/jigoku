import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MiwakuKabe extends DrawCard {
    static id = 'miwaku-kabe';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.interrupt({
            title: 'Shuffle this into deck',
            when: {
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            },
            effect: 'shuffle itself back into the dynasty deck',
            gameAction: ability.actions.returnToDeck({ shuffle: true })
        });
    }
}


export default MiwakuKabe;
