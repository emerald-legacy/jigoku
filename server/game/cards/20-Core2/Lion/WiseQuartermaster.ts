import { CardTypes, Locations, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { AbilityContext } from '../../../AbilityContext.js';

function attachedToType(context: AbilityContext): CardTypes {
    return ((context.target as DrawCard).parent as DrawCard).type;
}

export default class WiseQuartermaster extends DrawCard {
    static id = 'wise-quartermaster';

    setupCardAbilities() {
        this.action({
            title: 'Move an attachment',
            condition: (context) => !context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.selectCard((context) => {
                    const isOnProvince = attachedToType(context) === CardTypes.Province;
                    return {
                        cardType: isOnProvince ? CardTypes.Province : CardTypes.Character,
                        location: isOnProvince ? Locations.Provinces : Locations.PlayArea,
                        cardCondition: (card) =>
                            card !== context.target.parent && card.controller === context.target.parent.controller,
                        message: '{0} moves {1} to {2}',
                        messageArgs: (card) => [context.player, context.target, card],
                        gameAction: AbilityDsl.actions.attach({ attachment: context.target })
                    };
                })
            },
            effect: 'move {0} to another {1}',
            effectArgs: (context) => [attachedToType(context) === CardTypes.Province ? 'province' : 'character']
        });
    }
}
