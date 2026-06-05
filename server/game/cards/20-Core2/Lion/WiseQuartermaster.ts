import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { AbilityContext } from '../../../AbilityContext.js';

function attachedToType(context: AbilityContext<DrawCard, DrawCard>): CardType | undefined {
    return context.target?.parent?.type;
}

export default class WiseQuartermaster extends DrawCard {
    static id = 'wise-quartermaster';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Move an attachment',
            condition: (context) => !context.game.isDuringConflict(),
            target: {
                cardType: CardType.Attachment,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.selectCard<DrawCard>((context) => {
                    const isOnProvince = attachedToType(context) === CardType.Province;
                    return {
                        cardType: isOnProvince ? CardType.Province : CardType.Character,
                        location: isOnProvince ? Location.Provinces : Location.PlayArea,
                        cardCondition: (card) =>
                            card !== context.target?.parent && card.controller === context.target?.parent?.controller,
                        message: '{0} moves {1} to {2}',
                        messageArgs: (card) => [context.player, context.target ?? '', card],
                        gameAction: AbilityDsl.actions.attach({ attachment: context.target })
                    };
                })
            },
            effect: 'move {0} to another {1}',
            effectArgs: (context) => [attachedToType(context) === CardType.Province ? 'province' : 'character']
        });
    }
}
