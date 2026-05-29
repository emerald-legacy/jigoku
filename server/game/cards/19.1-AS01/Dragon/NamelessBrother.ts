import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardTypes } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class NamelessBrother extends DrawCard {
    static id = 'nameless-brother';

    public setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context?.player && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.modifyBothSkills((character: BaseCard, context: AbilityContext<this>) =>
                (context.player.cardsInPlay as BaseCard[]).reduce(
                    (skillBonus, otherCard) =>
                        otherCard.type === CardTypes.Character &&
                        otherCard.name === character.name &&
                        otherCard.uuid !== character.uuid
                            ? skillBonus + 1
                            : skillBonus,
                    0
                )
            )
        });
    }
}
