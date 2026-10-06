import { cannotContribute } from '../../../effects.js';
import { cardLastingEffect, onAffinity, removeFate, sequential } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { CharactersEnteredThisConflict } from '../../CharactersEnteredThisConflict.js';

export default class TheMaidensIcyGrasp extends DrawCard {
    static id = 'the-maiden-s-icy-grasp';

    public setupCardAbilities() {
        const charactersEntered = new CharactersEnteredThisConflict(this.game);
        this.action('Remove a character from play')
            .condition((context) =>
                context.player.cardsInPlay.some(
                    (card) => card.isParticipating() && card.hasTrait('shugenja')
                ))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => charactersEntered.has(card)
            }, sequential([
                cardLastingEffect((context) => ({
                    effect: [cannotContribute(() => (card) => card === context.target)]
                })),
                onAffinity({
                    trait: 'water',
                    gameAction: removeFate((context) => ({ target: context.target }))
                })
            ]))
            .effect('prevent {0} from contributing to resolution of this conflict');
    }
}
