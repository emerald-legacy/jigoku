import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import { AbilityContext } from '../../../AbilityContext.js';

/** The card the chosen attachment sits on. Null while it is on a ring, which this card cannot move. */
function attachedCard(context: AbilityContext<DrawCard, DrawCard>): BaseCard | null {
    return context.target?.attachedCharacter ?? context.target?.attachedProvince ?? null;
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
                    const attachedTo = attachedCard(context);
                    const isOnProvince = !!attachedTo?.isProvinceCard();
                    return {
                        cardType: isOnProvince ? CardType.Province : CardType.Character,
                        location: isOnProvince ? Location.Provinces : Location.PlayArea,
                        cardCondition: (card) => card !== attachedTo && card.controller === attachedTo?.controller,
                        message: '{0} moves {1} to {2}',
                        messageArgs: (card) => [context.player, context.target ?? '', card],
                        gameAction: AbilityDsl.actions.attach({ attachment: context.target })
                    };
                })
            },
            effect: 'move {0} to another {1}',
            effectArgs: (context) => [attachedCard(context)?.isProvinceCard() ? 'province' : 'character']
        });
    }
}
