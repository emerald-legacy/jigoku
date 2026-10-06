import { CardType, Players, TargetMode } from '../../../Constants.js';
import { addKeyword } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { BattlefieldAttachment } from '../../BattlefieldAttachment.js';

export default class DeclarationOfDominion extends BattlefieldAttachment {
    static id = 'declaration-of-dominion';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.action('Gives Pride to chosen characters')
            .condition((context) => !!context.source.parentProvince?.isConflictProvince())
            .targetCards({
                name: 'myCard',
                activePromptTitle: 'Choose a character on your side',
                mode: TargetMode.UpTo,
                numCards: 1,
                optional: true,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: addKeyword('pride')
            }))
            .targetCards({
                name: 'opponentsCard',
                activePromptTitle: 'Choose a character on the enemy side',
                mode: TargetMode.UpTo,
                numCards: 1,
                optional: true,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: addKeyword('pride')
            }))
            .effect('give pride to {1}', (context) => [
                (context.targets.myCard ?? []).concat(
                    context.targets.opponentsCard ?? []
                )
            ]);
    }

    protected unbrokenOnly() {
        return false;
    }
}
