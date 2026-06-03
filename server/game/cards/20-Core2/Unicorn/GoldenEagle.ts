import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment.js';

export default class GoldenEagle extends DrawCard {
    static id = 'golden-eagle';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));

        this.persistentEffect({
            condition: (context) => context.source.parent !== null,
            targetController: Players.Opponent,
            targetLocation: Location.PlayArea,
            match: (card) => card.type === CardType.Character,
            effect: AbilityDsl.effects.loseKeyword('covert')
        });
    }
}
