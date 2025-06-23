import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment';

export default class GoldenEagle extends DrawCard {
    static id = 'golden-eagle';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));

        this.persistentEffect({
            condition: (context) => context.source.parent != null,
            targetController: Players.Opponent,
            targetLocation: Locations.PlayArea,
            match: (card) => card.type === CardTypes.Character,
            effect: AbilityDsl.effects.loseKeyword('covert')
        });
    }
}
