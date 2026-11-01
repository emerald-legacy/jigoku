import { loseKeyword } from '../../../effects.js';
import { CardType, EffectName, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayCharacterAsAttachment } from '../../../PlayCharacterAsAttachment.js';

export default class GoldenEagle extends DrawCard {
    static id = 'golden-eagle';

    override setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));

        this.persistentEffect({
            condition: (context) => context.source.parentCharacter !== null,
            targetController: Players.Opponent,
            targetLocation: Location.PlayArea,
            match: (card) => card.type === CardType.Character,
            effect: loseKeyword('covert')
        });
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            // as an attachment it has only its attachment text (Serene Ise Zumi, ruling #851)
            condition: (context) => context.source.getEffects(EffectName.ChangeType).includes(CardType.Attachment),
            effect: loseKeyword('courtesy')
        });
    }
}
