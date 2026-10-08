import { CardType, Location, Players } from '../../../Constants.js';
import { attach, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

/** The card the chosen attachment sits on. Null while it is on a ring, which this card cannot move. */
function parentCard(context: AbilityContext): BaseCard | null {
    return context.target?.parentCharacter ?? context.target?.parentProvince ?? null;
}

export default class WiseQuartermaster extends DrawCard {
    static id = 'wise-quartermaster';

    setupCardAbilities() {
        this.action('Move an attachment')
            .condition((context) => !context.game.isDuringConflict())
            .target({
                cardType: CardType.Attachment,
                controller: Players.Self
            }, selectCard((context) => {
                const parent = parentCard(context);
                const isOnProvince = !!parent?.isProvinceCard();
                return {
                    cardType: isOnProvince ? CardType.Province : CardType.Character,
                    location: isOnProvince ? Location.Provinces : Location.PlayArea,
                    cardCondition: (card) => card !== parent && card.controller === parent?.controller,
                    message: '{0} moves {1} to {2}',
                    messageArgs: (card) => [context.player, context.target ?? '', card],
                    gameAction: attach({ attachment: context.target })
                };
            }))
            .chatText('move {0} to another {1}', (context) => [parentCard(context)?.isProvinceCard() ? 'province' : 'character']);
    }
}
