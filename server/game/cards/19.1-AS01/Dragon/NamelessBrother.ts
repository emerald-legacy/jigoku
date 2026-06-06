import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class NamelessBrother extends DrawCard {
    static id = 'nameless-brother';

    public setupCardAbilities() {
        this.persistentEffect({
            match: (card: DrawCard, context) => card.controller === context?.player && card.type === CardType.Character,
            effect: AbilityDsl.effects.modifyBothSkills((character: BaseCard, context) =>
                (context.player.cardsInPlay as BaseCard[]).reduce(
                    (skillBonus, otherCard) =>
                        otherCard.type === CardType.Character &&
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
