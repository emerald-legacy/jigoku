import type BaseCard from '../../BaseCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class SereneIseZumi extends DrawCard {
    static id = 'serene-ise-zumi';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.attachmentConditions({
            myControl: true
        });
        this.action({
            title: 'Move attached character home',
            printedAbility: false,
            condition: (context) =>
                !!(context.source.parent &&
                context.game.isDuringConflict() &&
                context.source.type === CardType.Attachment &&
                context.source.parent.isParticipating()),
            gameAction: AbilityDsl.actions.sendHome((context) => ({
                target: context.source.parent
            }))
        });
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            condition: (context) => context.source.type === CardType.Attachment,
            effect: AbilityDsl.effects.loseKeyword('sincerity')
        });
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 2,
                targetCondition: (target: BaseCard) => target.type === CardType.Character,
                match: (card: BaseCard, source: BaseCard) => card === source
            })
        });
    }
}
