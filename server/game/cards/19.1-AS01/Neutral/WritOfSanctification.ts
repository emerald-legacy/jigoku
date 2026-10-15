import { addKeyword, gainAbility } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import { CardType, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class WritOfSanctification extends DrawCard {
    static id = 'writ-of-sanctification';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: Trait.Shugenja
        });

        this.persistentEffect({
            condition: (context) =>
                !context.player.cardsInPlay.some(
                    (card) => card.hasTrait(Trait.Shadowlands) && card.type === CardType.Character
                ),
            effect: addKeyword('ancestral')
        });

        this.whileAttached({
            effect: gainAbility.conflictAction('Bow corrupt character', (ability) => ability
                .target({
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card) => card.isParticipating() && (card.hasTrait(Trait.Shadowlands) || card.isTainted)
                }, bow()))
        });
    }
}
