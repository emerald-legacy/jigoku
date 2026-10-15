import { modifyBothSkills } from '../../../effects.js';
import { CardType, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MalevolentAlchemist extends DrawCard {
    static id = 'malevolent-alchemist';

    override setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: (card) => card.type === CardType.Character,
            effect: modifyBothSkills((character) => -1 * character.attachments.filter((a) => a.hasTrait(Trait.Poison)).length)
        });
    }
}
