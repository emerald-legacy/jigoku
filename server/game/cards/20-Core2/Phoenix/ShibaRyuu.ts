import { changeConflictSkillFunction } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaRyuu extends DrawCard {
    static id = 'shiba-ryuu';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: changeConflictSkillFunction(
                (_card, _conflict, skills) => skills.military + skills.political
            )
        });
    }
}
