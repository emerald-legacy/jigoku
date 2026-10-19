import { cannotContribute } from '../../../effects.js';
import { cardLastingEffect, onAffinity, removeFate } from '../../../GameActions/GameActions.js';
import { CardType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { CharactersEnteredThisConflict } from '../../CharactersEnteredThisConflict.js';
import { controlsParticipating } from '../../controlsParticipating.js';

export default class TheMaidensIcyGrasp extends DrawCard {
    static id = 'the-maiden-s-icy-grasp';

    public override setupCardAbilities() {
        const charactersEntered = new CharactersEnteredThisConflict(this.game);
        this.conflictAction('Remove a character from play')
            .ifCondition((context) => controlsParticipating(context.player, Trait.Shugenja))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => charactersEntered.has(card)
            }, cardLastingEffect((context) => ({
                effect: [cannotContribute(() => (card) => card === context.target)]
            })), onAffinity({
                trait: Trait.Water,
                gameAction: removeFate()
            }))
            .chatText('prevent {0} from contributing to resolution of this conflict');
    }
}
