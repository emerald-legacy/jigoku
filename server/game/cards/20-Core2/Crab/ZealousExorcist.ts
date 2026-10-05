import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { CharactersEnteredThisConflict } from '../../CharactersEnteredThisConflict.js';

export default class ZealousExorcist extends DrawCard {
    static id = 'zealous-exorcist';

    public setupCardAbilities() {
        const charactersEntered = new CharactersEnteredThisConflict(this.game);
        this.action('Remove a character from play')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => charactersEntered.has(card)
            }, AbilityDsl.actions.removeFromGame());
    }
}
