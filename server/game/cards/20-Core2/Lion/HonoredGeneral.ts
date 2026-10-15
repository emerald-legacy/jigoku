import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class HonoredGeneral extends DrawCard {
    static id = 'honored-general';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            match: (card, context) => card.isParticipating() && card.isFaction('lion') && card !== context?.source,
            effect: modifyMilitarySkill(1)
        });

        this.reaction('Honor this character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .honor();
    }
}
