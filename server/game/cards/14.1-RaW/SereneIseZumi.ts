import { CardType, EffectName, Location, Players } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import type { Ring } from '../../Ring.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { loseKeyword, reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class SereneIseZumi extends DrawCard {
    static id = 'serene-ise-zumi';

    override setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.action('Move attached character home')
            .condition((context) =>
                !!(context.source.parentCharacter &&
                context.game.isDuringConflict() &&
                context.source.type === CardType.Attachment &&
                context.source.parentCharacter.isParticipating()))
            .sendHome((context) => ({
                target: context.source.parentCharacter ?? []
            }))
            .notPrinted();
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            // played as an attachment: it stays without sincerity if it becomes a character again (Togashi Hoshi)
            condition: (context) => context.source.getEffects(EffectName.ChangeType).includes(CardType.Attachment),
            effect: loseKeyword('sincerity')
        });
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: 2,
                targetCondition: (target) => target.type === CardType.Character,
                match: (card, source) => card === source
            })
        });
    }

    /** "On a character you control" only applies when playing it: it stays attached if you lose control. */
    override canPlayOn(card: BaseCard | Ring): boolean {
        return 'controller' in card && card.controller === this.controller && super.canPlayOn(card);
    }
}
