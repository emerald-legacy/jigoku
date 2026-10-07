import { CardType, Location, Players } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { loseKeyword, reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class SereneIseZumi extends DrawCard {
    static id = 'serene-ise-zumi';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.attachmentConditions({
            myControl: true
        });
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
            condition: (context) => context.source.type === CardType.Attachment,
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
}
