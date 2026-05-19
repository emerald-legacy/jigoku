import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment.js';

export default class GoldenEagle extends DrawCard {
    static id = 'golden-eagle';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));

        this.persistentEffect({
            condition: (context) => context.source.parent !== null,
            targetController: Players.Opponent,
            targetLocation: Locations.PlayArea,
            match: (card) => card.type === CardTypes.Character,
            effect: AbilityDsl.effects.loseKeyword('covert')
        });
    }
}
