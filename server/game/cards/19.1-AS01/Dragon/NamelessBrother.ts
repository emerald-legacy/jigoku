import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class NamelessBrother extends DrawCard {
    static id = 'nameless-brother';

    public setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context?.player && card.type === CardType.Character,
            effect: AbilityDsl.effects.modifyBothSkills((character, context) =>
                context.player.cardsInPlay.reduce(
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
