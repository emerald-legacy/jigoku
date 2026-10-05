import AbilityDsl from '../../../abilitydsl.js';
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
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: [AbilityDsl.effects.cannotContribute(() => (card) => card === context.target)]
                })),
                AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    gameAction: AbilityDsl.actions.removeFate((context) => ({ target: context.target }))
                })
            ]))
            .effect('prevent {0} from contributing to resolution of this conflict');
    }
}
